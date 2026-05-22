import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

import { getApiBaseUrl } from "@/src/lib/api-base-url";
import { isJwtExpired } from "@/src/lib/jwt";
import {
  isAuthHttpError,
  refreshCustomerSession,
} from "@/src/services/auth-api";
import {
  clearCustomerSessionTokens,
  loadAccessToken,
  loadRefreshToken,
  saveCustomerSessionTokens,
} from "@/src/services/session-tokens";

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshToken = await loadRefreshToken();
      if (!refreshToken) {
        await clearCustomerSessionTokens();
        return null;
      }
      try {
        const data = await refreshCustomerSession(refreshToken);
        await saveCustomerSessionTokens(data.accessToken, data.refreshToken);
        return data.accessToken;
      } catch (e) {
        if (isAuthHttpError(e)) {
          await clearCustomerSessionTokens();
        }
        return null;
      } finally {
        refreshPromise = null;
      }
    })();
  }
  return refreshPromise;
}

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 25_000,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use(async (config) => {
  let token = await loadAccessToken();
  if (token && isJwtExpired(token)) {
    token = await refreshAccessToken();
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryConfig | undefined;
    if (!config || config._retry || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    config._retry = true;
    const nextToken = await refreshAccessToken();
    if (!nextToken) {
      return Promise.reject(error);
    }

    config.headers.Authorization = `Bearer ${nextToken}`;
    return apiClient.request(config);
  }
);
