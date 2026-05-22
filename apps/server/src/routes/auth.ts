import { Router, type IRouter } from "express";
import jwt from "jsonwebtoken";
import {
  getCustomerProfile,
  isProfileComplete,
} from "../lib/customer-profiles.js";
import {
  getJwtSecrets,
  signCustomerAccessToken,
  signCustomerRefreshToken,
  verifyCustomerRefreshToken,
} from "../lib/customer-jwt.js";
import { ensureFirebaseAdmin, verifyFirebaseCustomerIdToken } from "../lib/firebase-admin.js";
import { requireCustomerJwt } from "../middleware/require-customer-jwt.js";

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

    const secrets = getJwtSecrets();
    if (!secrets) {
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
    const accessToken = signCustomerAccessToken(sub, phone, secrets.accessSecret);
    const refreshToken = signCustomerRefreshToken(sub, phone, secrets.refreshSecret);

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

authRouter.post("/refresh", async (req, res, next) => {
  try {
    const secrets = getJwtSecrets();
    if (!secrets) {
      res.status(503).json({
        error: "jwt_unconfigured",
        message:
          "Set JWT_ACCESS_SECRET and JWT_REFRESH_SECRET in the server environment.",
      });
      return;
    }

    const refreshRaw = req.body?.refreshToken;
    const refreshToken =
      typeof refreshRaw === "string" ? refreshRaw.trim() : "";

    if (!refreshToken) {
      res.status(400).json({
        error: "missing_refresh_token",
        message: "Expected refreshToken in JSON body.",
      });
      return;
    }

    let decoded: jwt.JwtPayload;
    try {
      decoded = verifyCustomerRefreshToken(refreshToken, secrets.refreshSecret);
    } catch {
      res.status(401).json({
        error: "invalid_refresh_token",
        message: "Refresh token is invalid or expired.",
      });
      return;
    }

    const sub = decoded.sub!;
    const phone = decoded.phone_number as string;

    const accessToken = signCustomerAccessToken(sub, phone, secrets.accessSecret);
    const nextRefreshToken = signCustomerRefreshToken(sub, phone, secrets.refreshSecret);

    res.json({
      accessToken,
      refreshToken: nextRefreshToken,
      expiresIn: 900,
    });
  } catch (e) {
    next(e);
  }
});

authRouter.post("/logout", requireCustomerJwt, async (_req, res) => {
  // Stateless JWT: client clears tokens; endpoint exists for symmetry and future revocation.
  res.status(204).send();
});
