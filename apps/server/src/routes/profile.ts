import { Router, type IRouter } from "express";
import { appendActivityLog } from "../lib/activity-logs.js";
import { upsertCustomerCartSnapshot } from "../lib/customer-carts.js";
import {
  getCustomerProfile,
  isProfileComplete,
  upsertCustomerProfile,
} from "../lib/customer-profiles.js";
import { requireCustomerJwt } from "../middleware/require-customer-jwt.js";

export const profileRouter: IRouter = Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

profileRouter.use(requireCustomerJwt);

profileRouter.get("/me", async (req, res, next) => {
  try {
    const uid = req.customer!.sub;
    const profile = await getCustomerProfile(uid);
    res.json({
      profile,
      profileComplete: isProfileComplete(profile),
    });
  } catch (e) {
    next(e);
  }
});

profileRouter.put("/me", async (req, res, next) => {
  try {
    const customer = req.customer!;
    const nameRaw = req.body?.name;
    const name = typeof nameRaw === "string" ? nameRaw.trim() : "";

    if (!name) {
      res.status(400).json({
        error: "validation_error",
        message: "Name is required.",
      });
      return;
    }

    const phoneRaw = req.body?.phoneNumber;
    const phoneNumber =
      typeof phoneRaw === "string" && phoneRaw.trim()
        ? phoneRaw.trim()
        : customer.phone_number;

    if (phoneNumber !== customer.phone_number) {
      res.status(400).json({
        error: "validation_error",
        message: "Phone number cannot be changed during onboarding.",
      });
      return;
    }

    const emailRaw = req.body?.email;
    const email =
      typeof emailRaw === "string" ? emailRaw.trim() : undefined;
    if (email && !EMAIL_RE.test(email)) {
      res.status(400).json({
        error: "validation_error",
        message: "Enter a valid email address.",
      });
      return;
    }

    const addressRaw = req.body?.address;
    const address =
      typeof addressRaw === "string" ? addressRaw.trim() : undefined;

    const avatarRaw = req.body?.avatarUrl;
    const avatarUrl =
      typeof avatarRaw === "string" ? avatarRaw.trim() : "";
    if (!avatarUrl) {
      res.status(400).json({
        error: "validation_error",
        message: "Avatar URL is required.",
      });
      return;
    }

    const profile = await upsertCustomerProfile(customer.sub, {
      name,
      phoneNumber,
      email,
      address,
      avatarUrl,
    });

    res.json({
      profile,
      profileComplete: isProfileComplete(profile),
    });
  } catch (e) {
    next(e);
  }
});

/** Sync cart snapshot for admin abandonment tracking. */
profileRouter.post("/cart-sync", async (req, res, next) => {
  try {
    const customerId = req.customer!.sub;
    const lines = Array.isArray(req.body?.lines) ? req.body.lines : [];
    const currency = typeof req.body?.currency === "string" ? req.body.currency : "INR";
    const estimatedTotalCents =
      typeof req.body?.estimatedTotalCents === "number"
        ? req.body.estimatedTotalCents
        : 0;

    const profile = await getCustomerProfile(customerId);
    await upsertCustomerCartSnapshot({
      customerId,
      lines,
      currency,
      estimatedTotalCents,
      contactEmail: profile?.email,
      contactPhone: profile?.phoneNumber,
    });

    await appendActivityLog(customerId, {
      type: "cart_sync",
      label: "Cart updated",
      metadata: { itemCount: lines.length },
    });

    res.status(204).end();
  } catch (e) {
    next(e);
  }
});

/** Record in-app activity for admin user detail view. */
profileRouter.post("/activity", async (req, res, next) => {
  try {
    const customerId = req.customer!.sub;
    const type = typeof req.body?.type === "string" ? req.body.type : "event";
    const label = typeof req.body?.label === "string" ? req.body.label : "Activity";
    const metadata =
      req.body?.metadata && typeof req.body.metadata === "object"
        ? req.body.metadata
        : undefined;

    await appendActivityLog(customerId, { type, label, metadata });
    res.status(204).end();
  } catch (e) {
    next(e);
  }
});
