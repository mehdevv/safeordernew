import { setAuthTokenGetter } from "@workspace/api-client-react";

const CLIENT_TOKEN_KEY = "safeorder_client_token";
const CLIENT_PROFILE_KEY = "safeorder_client_profile";
const MERCHANT_TOKEN_KEY = "safeorder_token";

export type StoredClientProfile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  wilaya?: string;
  createdAt: string;
};

export function getClientToken(): string | null {
  return localStorage.getItem(CLIENT_TOKEN_KEY);
}

export function setClientToken(token: string): void {
  localStorage.setItem(CLIENT_TOKEN_KEY, token);
}

export function getClientProfile(): StoredClientProfile | null {
  try {
    const raw = localStorage.getItem(CLIENT_PROFILE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredClientProfile;
  } catch {
    return null;
  }
}

export function setClientProfile(profile: StoredClientProfile): void {
  localStorage.setItem(CLIENT_PROFILE_KEY, JSON.stringify(profile));
}

export function clearClientProfile(): void {
  localStorage.removeItem(CLIENT_PROFILE_KEY);
}

/** Stub tokens : `stub-client-tel-{digits}` (connexion téléphone + OTP). */
export function parseClientPhoneFromStubToken(token: string | null): string | null {
  const prefix = "stub-client-tel-";
  if (!token?.startsWith(prefix)) return null;
  const digits = token.slice(prefix.length).replace(/\D/g, "");
  return digits.length >= 9 ? digits : null;
}

/** @deprecated Ancien format email */
export function parseClientEmailFromStubToken(token: string | null): string | null {
  if (!token?.startsWith("stub-client-")) return null;
  if (token.startsWith("stub-client-tel-")) return null;
  const rest = token.slice("stub-client-".length);
  return rest.includes("@") ? rest : null;
}

export function clearClientToken(): void {
  localStorage.removeItem(CLIENT_TOKEN_KEY);
  clearClientProfile();
}

export function isClientAuthenticated(): boolean {
  return !!getClientToken();
}

export function activateClientAuth(): void {
  setAuthTokenGetter(() => getClientToken());
}

export function activateMerchantAuth(): void {
  setAuthTokenGetter(() => localStorage.getItem(MERCHANT_TOKEN_KEY));
}
