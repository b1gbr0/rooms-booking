import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { Booking } from '@prisma/client';

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateRoomDto) {
    return this.prisma.room.create({ data });
  }

  async findAll() {
    const rooms = await this.prisma.room.findMany({
      orderBy: { name: 'asc' },
      include: { bookings: true },
    });
    return rooms.map((room) => {
      return { ...room, freeSlots: this.getFreeSlots(room.bookings) };
    });
  }

  async findById(id: string) {
    const room = await this.prisma.room.findUnique({
      where: { id },
      include: { bookings: true },
    });
    if (!room) {
      return null;
    }
    return { ...room, freeSlots: this.getFreeSlots(room.bookings) };
  }

  remove(id: string) {
    return this.prisma.room.delete({ where: { id } });
  }

  getFreeSlots(bookings: Booking[], now: Date = new Date()) {
    const freeSlots: { start: Date; end?: Date }[] = [];
    let cursor = now;

    for (const booking of bookings) {
      if (booking.startTime > cursor) {
        freeSlots.push({ start: cursor, end: booking.startTime });
      }
      if (booking.endTime > cursor) {
        cursor = booking.endTime;
      }
    }

    const farFuture = new Date(now);
    farFuture.setMonth(farFuture.getMonth() + 1);
    if (cursor < farFuture) {
      freeSlots.push({ start: cursor });
    }

    return freeSlots;
  }
}
