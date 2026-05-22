import { useAuthSession } from "@/src/stores/auth-session";
import { useCart } from "@/src/stores/cart";
import { useCustomerProfile } from "@/src/stores/customer-profile";

void Promise.all([
  useAuthSession.getState().bootstrap(),
  useCustomerProfile.getState().hydrate(),
  useCart.getState().hydrate(),
]);
