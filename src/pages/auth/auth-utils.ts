/**
 * Non-component exports for the auth pages.
 *
 * Keep this file free of React components so Vite's Fast Refresh treats
 * `AuthShell.tsx` and related pages as component-only modules.
 */
export const PWD_BAR_COLORS = [
  "#e4e8f3",
  "#ff6f6f",
  "#ffa84d",
  "#ffd24d",
  "#5dd39e",
  "#1b3fd8",
];

export function strengthOf(pwd: string): number {
  let s = 0;
  if (pwd.length >= 8) s++;
  if (pwd.length >= 12) s++;
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) s++;
  if (/\d/.test(pwd)) s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  return Math.min(s, 4);
}
