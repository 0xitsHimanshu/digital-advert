/** Figma 2212:310 — Save details onboarding artboard */
export const DESIGN_W = 1080;
export const DESIGN_H = 2340;

/** Teal header: top -0.98%, bottom inset 78.55% → ~502px tall (shorter than login 752px). */
export const SAVE_HEADER_TOP = -23;
export const SAVE_HEADER_HEIGHT = 502;

export const SAVE_FIELD_SHELL_W = 948.785;
export const SAVE_FIELD_SHELL_H = 141.308;
export const SAVE_FIELD_SHELL_LEFT = (DESIGN_W - SAVE_FIELD_SHELL_W) / 2;
export const SAVE_FIELD_LABEL_LEFT = 63.08;

export const SAVE_AVATAR_SIZE = 266;
export const SAVE_AVATAR_TOP = 349;
export const SAVE_AVATAR_LEFT = (DESIGN_W - SAVE_AVATAR_SIZE) / 2;

export const SAVE_BTN_TOP = 1795;
export const SAVE_BTN_W = 930.224;
export const SAVE_BTN_H = 146.138;
export const SAVE_BTN_LEFT = (DESIGN_W - SAVE_BTN_W) / 2;
export const SAVE_ARROW_FRAME_LEFT = DESIGN_W * 0.8 + 17 - SAVE_BTN_LEFT;
export const SAVE_ARROW_TOP = 1833.55 - SAVE_BTN_TOP;
export const SAVE_ARROW_FRAME = 67.448;

/** Figma 2212:347 — swirl doodle beside header */
export const SAVE_DOODLE_LEFT = DESIGN_W * 0.6 + 32;
export const SAVE_DOODLE_TOP = 272;

/** Lowest interactive content — for keyboard shift (save button bottom). */
export const SAVE_CONTENT_BOTTOM_DESIGN = SAVE_BTN_TOP + SAVE_BTN_H;

export const saveDetailsFields = {
  name: { labelTop: 684, shellTop: 754.65 },
  phone: { labelTop: 936.34, shellTop: 1006.99 },
  email: { labelTop: 1188.27, shellTop: 1258.93 },
  address: { labelTop: 1440.23, shellTop: 1510.89 },
} as const;
