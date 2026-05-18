import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export type CustomerJwtPayload = {
  sub: string;
  role: string;
  phone_number: string;
};

declare module "express-serve-static-core" {
  interface Request {
    customer?: CustomerJwtPayload;
  }
}

export function requireCustomerJwt(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const accessSecret = process.env.JWT_ACCESS_SECRET?.trim();
  if (!accessSecret) {
    res.status(503).json({
      error: "jwt_unconfigured",
      message: "Set JWT_ACCESS_SECRET in the server environment.",
    });
    return;
  }

  const header = req.headers.authorization;
  const token =
    typeof header === "string" && header.startsWith("Bearer ")
      ? header.slice(7).trim()
      : "";

  if (!token) {
    res.status(401).json({
      error: "missing_token",
      message: "Authorization Bearer token is required.",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, accessSecret) as jwt.JwtPayload;
    if (decoded.role !== "ROLE_CUSTOMER" || typeof decoded.sub !== "string") {
      res.status(403).json({
        error: "forbidden",
        message: "Customer access token required.",
      });
      return;
    }
    const phone =
      typeof decoded.phone_number === "string" ? decoded.phone_number : "";
    if (!phone) {
      res.status(403).json({
        error: "invalid_token_phone",
        message: "Token is missing phone_number.",
      });
      return;
    }

    req.customer = {
      sub: decoded.sub,
      role: decoded.role as string,
      phone_number: phone,
    };
    next();
  } catch {
    res.status(401).json({
      error: "invalid_token",
      message: "Access token is invalid or expired.",
    });
  }
}
