import jwt from "jsonwebtoken";

export type CustomerAccessClaims = {
  role: "ROLE_CUSTOMER";
  phone_number: string;
};

export function getJwtSecrets(): {
  accessSecret: string;
  refreshSecret: string;
} | null {
  const accessSecret = process.env.JWT_ACCESS_SECRET?.trim();
  const refreshSecret = process.env.JWT_REFRESH_SECRET?.trim();
  if (!accessSecret || !refreshSecret) return null;
  return { accessSecret, refreshSecret };
}

export function signCustomerAccessToken(
  sub: string,
  phone: string,
  accessSecret: string,
): string {
  return jwt.sign(
    {
      role: "ROLE_CUSTOMER",
      phone_number: phone,
    } satisfies CustomerAccessClaims,
    accessSecret,
    {
      subject: sub,
      expiresIn: "15m",
    },
  );
}

export function signCustomerRefreshToken(
  sub: string,
  phone: string,
  refreshSecret: string,
): string {
  return jwt.sign(
    { token_use: "refresh", phone_number: phone },
    refreshSecret,
    {
      subject: sub,
      expiresIn: "30d",
    },
  );
}

export function verifyCustomerRefreshToken(
  token: string,
  refreshSecret: string,
): jwt.JwtPayload {
  const decoded = jwt.verify(token, refreshSecret) as jwt.JwtPayload;
  if (
    decoded.token_use !== "refresh" ||
    typeof decoded.sub !== "string" ||
    typeof decoded.phone_number !== "string" ||
    !decoded.phone_number
  ) {
    throw new jwt.JsonWebTokenError("Invalid refresh token.");
  }
  return decoded;
}
