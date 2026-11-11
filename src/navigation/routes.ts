export const Routes = {
  CHAT: '/',
  EXPLORE: '/explore',
} as const;

export type AppRoute = (typeof Routes)[keyof typeof Routes];

