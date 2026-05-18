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
