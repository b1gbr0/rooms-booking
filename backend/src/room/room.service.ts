import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateRoomDto) {
    return this.prisma.room.create({ data });
  }

  findAll() {
    return this.prisma.room.findMany({ orderBy: { name: 'asc' } });
  }

  findById(id: string) {
    return this.prisma.room.findUnique({
      where: { id },
      include: { bookings: true },
    });
  }

  remove(id: string) {
    return this.prisma.room.delete({ where: { id } });
  }
}
