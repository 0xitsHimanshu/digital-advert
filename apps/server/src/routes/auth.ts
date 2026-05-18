import { Router, type IRouter } from "express";
import jwt from "jsonwebtoken";
import {
  getCustomerProfile,
  isProfileComplete,
} from "../lib/customer-profiles.js";
import { ensureFirebaseAdmin, verifyFirebaseCustomerIdToken } from "../lib/firebase-admin.js";

export const authRouter: IRouter = Router();

authRouter.post("/firebase-exchange", async (req, res, next) => {
  try {
    const idTokenRaw = req.body?.idToken;
    const idToken = typeof idTokenRaw === "string" ? idTokenRaw.trim() : "";

    const adminErr = ensureFirebaseAdmin();
    if (adminErr) {
      res.status(503).json({
        error: "firebase_admin_unconfigured",
        message: adminErr,
      });
      return;
    }

    const accessSecret = process.env.JWT_ACCESS_SECRET?.trim();
    const refreshSecret = process.env.JWT_REFRESH_SECRET?.trim();

    if (!accessSecret || !refreshSecret) {
      res.status(503).json({
        error: "jwt_unconfigured",
        message:
          "Set JWT_ACCESS_SECRET and JWT_REFRESH_SECRET in the server environment.",
      });
      return;
    }

    if (!idToken) {
      res.status(400).json({ error: "missing_id_token", message: "Expected idToken in JSON body." });
      return;
    }

    let decoded;
    try {
      decoded = await verifyFirebaseCustomerIdToken(idToken);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Invalid Firebase ID token.";
      res.status(401).json({
        error: "invalid_firebase_token",
        message: msg,
      });
      return;
    }
    const phone = decoded.phone_number;

    if (!phone || typeof phone !== "string") {
      res.status(403).json({
        error: "invalid_token_phone",
        message: "Firebase ID token must belong to a phone-authenticated user.",
      });
      return;
    }

    const sub = decoded.uid;
    const accessToken = jwt.sign(
      {
        role: "ROLE_CUSTOMER",
        phone_number: phone,
      },
      accessSecret,
      {
        subject: sub,
        expiresIn: "15m",
      },
    );

    const refreshToken = jwt.sign(
      { token_use: "refresh" },
      refreshSecret,
      {
        subject: sub,
        expiresIn: "30d",
      },
    );

    const existingProfile = await getCustomerProfile(sub);

    res.json({
      accessToken,
      refreshToken,
      expiresIn: 900,
      uid: sub,
      phoneNumber: phone,
      profileComplete: isProfileComplete(existingProfile),
    });
  } catch (e) {
    next(e);
  }
});
