export const Routes = {
  CHAT: '/',
} as const;

export type AppRoute = (typeof Routes)[keyof typeof Routes];
