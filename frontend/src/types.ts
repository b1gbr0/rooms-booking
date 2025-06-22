export interface Room {
  id: string;
  name: string;
  capacity: number;
  location: string;
}

export interface JwtPayload {
  role: string;
}
