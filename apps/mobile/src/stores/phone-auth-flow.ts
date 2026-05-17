import type { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { create } from "zustand";

export type PhoneAuthFlowState = {
  /** E.164 phone number for the in-flight verification (e.g. +911234567890). */
  e164Phone: string | null;
  confirmation: FirebaseAuthTypes.ConfirmationResult | null;
  setSession: (
    e164Phone: string,
    confirmation: FirebaseAuthTypes.ConfirmationResult
  ) => void;
  clear: () => void;
};

export const usePhoneAuthFlow = create<PhoneAuthFlowState>((set) => ({
  e164Phone: null,
  confirmation: null,
  setSession: (e164Phone, confirmation) =>
    set({ e164Phone, confirmation }),
  clear: () => set({ e164Phone: null, confirmation: null }),
}));
