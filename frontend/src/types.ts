export interface Room {
  id: string;
  name: string;
  capacity: number;
  location: string;
  freeSlots: { start: Date, end?: Date }[]
}

export interface JwtPayload {
  role: string;
}
