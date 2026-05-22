import axios from "axios";

import { getApiBaseUrl } from "@/src/lib/api-base-url";

export type FirebaseExchangeResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  uid: string;
  phoneNumber: string;
  profileComplete: boolean;
};

export type RefreshSessionResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

export type CustomerProfileResponse = {
  profile: {
    uid: string;
    name: string;
    phoneNumber: string;
    email?: string;
    address?: string;
    avatarUrl: string;
    updatedAt: string;
  } | null;
  profileComplete: boolean;
};

export function formatAuthApiError(e: unknown): string {
  if (axios.isAxiosError(e)) {
    const data = e.response?.data as { message?: string } | undefined;
    if (data?.message && typeof data.message === "string") return data.message;
    if (e.code === "ECONNABORTED") {
      return "The server took too long to respond.";
    }
    if (e.response == null) {
      return "Could not reach the server. Check your network and API base URL.";
    }
    return e.message;
  }
  if (e instanceof Error) return e.message;
  return "Could not complete sign-in.";
}

export function isAuthHttpError(e: unknown): boolean {
  if (!axios.isAxiosError(e) || e.response == null) return false;
  const status = e.response.status;
  return status === 401 || status === 403;
}

export function isNetworkError(e: unknown): boolean {
  return axios.isAxiosError(e) && e.response == null;
}

export async function exchangeFirebaseIdTokenForJwt(
  idToken: string
): Promise<FirebaseExchangeResponse> {
  const { data } = await axios.post<FirebaseExchangeResponse>(
    `${getApiBaseUrl()}/api/auth/firebase-exchange`,
    { idToken },
    {
      headers: { "Content-Type": "application/json" },
      timeout: 25_000,
    }
  );
  return data;
}

export async function refreshCustomerSession(
  refreshToken: string
): Promise<RefreshSessionResponse> {
  const { data } = await axios.post<RefreshSessionResponse>(
    `${getApiBaseUrl()}/api/auth/refresh`,
    { refreshToken },
    {
      headers: { "Content-Type": "application/json" },
      timeout: 25_000,
    }
  );
  return data;
}

export async function logoutCustomer(accessToken: string): Promise<void> {
  await axios.post(
    `${getApiBaseUrl()}/api/auth/logout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      timeout: 25_000,
      validateStatus: (status) => status === 204 || status === 200,
    }
  );
}

export async function fetchCustomerProfileMe(
  accessToken: string
): Promise<CustomerProfileResponse> {
  const { data } = await axios.get<CustomerProfileResponse>(
    `${getApiBaseUrl()}/api/profile/me`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      timeout: 25_000,
    }
  );
  return data;
}
