export type JwtPayload = {
  userId: string;
  login: string;
  exp?: number;
  iat?: number;
};
