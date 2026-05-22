import { create } from "zustand";

import { getCustomerProfile, type CustomerProfile } from "@/src/services/profile-api";
import {
  clearCachedCustomerProfile,
  loadCachedCustomerProfile,
  saveCachedCustomerProfile,
} from "@/src/services/session-profile-cache";

type CustomerProfileState = {
  name: string | null;
  avatarUrl: string | null;
  email: string | null;
  phoneNumber: string | null;
  address: string | null;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  setProfile: (profile: CustomerProfile) => Promise<void>;
  refresh: () => Promise<void>;
  clear: () => Promise<void>;
};

function profileToState(profile: CustomerProfile) {
  return {
    name: profile.name.trim(),
    avatarUrl: profile.avatarUrl?.trim() || null,
    email: profile.email?.trim() || null,
    phoneNumber: profile.phoneNumber?.trim() || null,
    address: profile.address?.trim() || null,
  };
}

export const useCustomerProfile = create<CustomerProfileState>((set, get) => ({
  name: null,
  avatarUrl: null,
  email: null,
  phoneNumber: null,
  address: null,
  hydrated: false,

  hydrate: async () => {
    const cached = await loadCachedCustomerProfile();
    set({
      name: cached?.name ?? null,
      avatarUrl: cached?.avatarUrl ?? null,
      email: cached?.email ?? null,
      phoneNumber: cached?.phoneNumber ?? null,
      address: cached?.address ?? null,
      hydrated: true,
    });
  },

  setProfile: async (profile) => {
    const next = profileToState(profile);
    set(next);
    await saveCachedCustomerProfile({
      name: next.name,
      ...(next.avatarUrl ? { avatarUrl: next.avatarUrl } : {}),
      ...(next.email ? { email: next.email } : {}),
      ...(next.phoneNumber ? { phoneNumber: next.phoneNumber } : {}),
      ...(next.address ? { address: next.address } : {}),
    });
  },

  refresh: async () => {
    try {
      const profile = await getCustomerProfile();
      if (profile?.name) {
        await get().setProfile(profile);
      }
    } catch {
      // Keep cached profile when offline.
    }
  },

  clear: async () => {
    await clearCachedCustomerProfile();
    set({
      name: null,
      avatarUrl: null,
      email: null,
      phoneNumber: null,
      address: null,
      hydrated: true,
    });
  },
}));
