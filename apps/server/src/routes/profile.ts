import { Router, type IRouter } from "express";
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
