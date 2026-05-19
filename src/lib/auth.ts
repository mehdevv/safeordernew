import { setAuthTokenGetter } from "@workspace/api-client-react";

export function getToken(): string | null {
  return localStorage.getItem("safeorder_token");
}

export function setToken(token: string): void {
  localStorage.setItem("safeorder_token", token);
}

export function clearToken(): void {
  localStorage.removeItem("safeorder_token");
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

// Default: use merchant token
setAuthTokenGetter(() => getToken());
