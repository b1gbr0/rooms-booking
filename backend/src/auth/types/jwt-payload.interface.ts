export interface JwtPayload {
  sub: string;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
}
