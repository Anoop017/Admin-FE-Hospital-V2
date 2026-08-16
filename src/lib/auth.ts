import type { AuthUser, LoginResponse } from "@/types";

const TOKEN_KEY = "medadmin_access_token";
const REFRESH_KEY = "medadmin_refresh_token";
const USER_KEY = "medadmin_user";

// ── Token helpers ────────────────────────────────────
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_KEY);
}

export function setTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_KEY, refreshToken);
}

export function removeTokens(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
}

// ── User helpers ─────────────────────────────────────
export function getUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function setUser(user: AuthUser): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// ── Session helpers ──────────────────────────────────
export function saveSession(response: LoginResponse): void {
  setTokens(response.accessToken, response.refreshToken);
  setUser(response.user);
}

export function clearSession(): void {
  removeTokens();
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
