import axios from "axios";

import { apiClient } from "@/src/services/api-client";

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

export async function getCustomerProfile(): Promise<CustomerProfile | null> {
  const { data } = await apiClient.get<{
    profile: CustomerProfile | null;
    profileComplete: boolean;
  }>("/api/profile/me");

  return data.profile;
}

export async function saveCustomerProfile(
  payload: SaveProfilePayload
): Promise<CustomerProfile> {
  const { data } = await apiClient.put<{ profile: CustomerProfile }>(
    "/api/profile/me",
    payload
  );

  return data.profile;
}
