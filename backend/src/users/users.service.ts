import { Role, User } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PartialBy } from '../common/utils';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  static readonly safeUserSelect = {
    id: true,
    email: true,
    username: true,
    role: true,
  };

  async findByEmail(
    email: string,
    includePassword: boolean = false,
  ): Promise<PartialBy<User, 'password'> | null> {
    return await this.prisma.user.findUnique({
      where: { email },
      select: includePassword
        ? { ...UsersService.safeUserSelect, password: true }
        : UsersService.safeUserSelect,
    });
  }

  async create(
    email: string,
    username: string,
    hashedPassword: string,
  ): Promise<User> {
    return this.prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        role: Role.USER,
      },
    });
  }
}
