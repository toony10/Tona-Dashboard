/**
 * Detail-page action intents → Button variants.
 * Render primary first, then secondary actions, then destroy last.
 */
export const actionButtonVariant = {
  primary: "default",
  secondary: "outline-primary",
  destroy: "destructive",
} as const;

export type ActionIntent = keyof typeof actionButtonVariant;
