import jwt from "jsonwebtoken";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createApp } from "../app.js";
import { signCustomerRefreshToken } from "../lib/customer-jwt.js";

const ACCESS_SECRET = "test-access-secret";
const REFRESH_SECRET = "test-refresh-secret";

describe("POST /api/auth/refresh", () => {
  beforeEach(() => {
    process.env.JWT_ACCESS_SECRET = ACCESS_SECRET;
    process.env.JWT_REFRESH_SECRET = REFRESH_SECRET;
  });

  afterEach(() => {
    delete process.env.JWT_ACCESS_SECRET;
    delete process.env.JWT_REFRESH_SECRET;
  });

  it("returns new tokens for a valid refresh token", async () => {
    const refreshToken = signCustomerRefreshToken(
      "uid-1",
      "+911234567890",
      REFRESH_SECRET
    );

    const app = createApp();
    const res = await request(app)
      .post("/api/auth/refresh")
      .send({ refreshToken })
      .expect(200);

    expect(res.body.accessToken).toBeTruthy();
    expect(res.body.refreshToken).toBeTruthy();
    expect(res.body.expiresIn).toBe(900);

    const decoded = jwt.verify(res.body.accessToken, ACCESS_SECRET) as jwt.JwtPayload;
    expect(decoded.sub).toBe("uid-1");
    expect(decoded.phone_number).toBe("+911234567890");
  });

  it("rejects invalid refresh tokens", async () => {
    const app = createApp();
    await request(app)
      .post("/api/auth/refresh")
      .send({ refreshToken: "not-a-real-token" })
      .expect(401);
  });
});
