import { Role } from '@prisma/client';

declare global {
  namespace Express {
    interface User {
      userId: string;
      email: string;
      username: string;
      role: Role;
    }
  }
}
