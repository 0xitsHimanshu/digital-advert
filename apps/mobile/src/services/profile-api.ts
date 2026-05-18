import axios from "axios";

import { getApiBaseUrl } from "@/src/lib/api-base-url";
import { loadAccessToken } from "@/src/services/session-tokens";

export type CustomerProfile = {
  uid: string;
  name: string;
  phoneNumber: string;
  email?: string;
  address?: string;
  avatarUrl: string;
  updatedAt: string;
};

export type SaveProfilePayload = {
  name: string;
  phoneNumber: string;
  email?: string;
  address?: string;
  avatarUrl: string;
};

export function formatProfileApiError(e: unknown): string {
  if (axios.isAxiosError(e)) {
    const data = e.response?.data as { message?: string } | undefined;
    if (data?.message && typeof data.message === "string") return data.message;
    if (e.response == null) {
      return "Could not reach the server. Check your network and API base URL.";
    }
    return e.message;
  }
  if (e instanceof Error) return e.message;
  return "Could not save your details.";
}

export async function saveCustomerProfile(
  payload: SaveProfilePayload
): Promise<CustomerProfile> {
  const token = await loadAccessToken();
  if (!token) {
    throw new Error("You are not signed in. Please verify your phone again.");
  }

  const { data } = await axios.put<{ profile: CustomerProfile }>(
    `${getApiBaseUrl()}/api/profile/me`,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      timeout: 25_000,
    }
  );

  return data.profile;
}
