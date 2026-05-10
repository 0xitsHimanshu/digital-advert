/**
 * Design tokens — replace with Figma variables when MCP / exports are available.
 */
export const colors = {
  background: "#F6F7F9",
  surface: "#FFFFFF",
  primary: "#1B4DFF",
  primaryPressed: "#153DBF",
  textPrimary: "#0F172A",
  textSecondary: "#64748B",
  textMuted: "#94A3B8",
  border: "#E2E8F0",
  borderFocus: "#1B4DFF",
  otpBoxEmpty: "#FFFFFF",
  otpBoxFilled: "#EEF2FF",
  success: "#16A34A",
  error: "#DC2626",
  // Onboarding / Start screen palette (from Figma)
  startBackground: "#FFFDF8",
  startCircle: "#FFF6E1",
  startAccent: "#1C6179",
  startSubtitle: "#A4A4A4",
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
} as const;
