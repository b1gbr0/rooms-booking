import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async createBooking(userId: string, dto: CreateBookingDto) {
    const { name, startTime, endTime } = dto;

    if (new Date(startTime) >= new Date(endTime)) {
      throw new BadRequestException('End time must be after start time');
    }

    // Validate room existence
    const roomId = await this.prisma.room
      .findUnique({ where: { name } })
      .then((room) => {
        if (!room) {
          throw new BadRequestException('Room does not exist');
        }
        return room.id;
      });

    // Check for overlapping bookings
    const overlap = await this.prisma.booking.findFirst({
      where: {
        roomId,
        OR: [
          {
            startTime: { lt: new Date(endTime) },
            endTime: { gt: new Date(startTime) },
          },
        ],
      },
    });

    if (overlap) {
      throw new BadRequestException(
        'Room is already booked for this time slot',
      );
    }

    return this.prisma.booking.create({
      data: {
        userId,
        roomId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      },
    });
  }

  findBookingsByUser(userId: string) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: { room: true },
      orderBy: { startTime: 'asc' },
    });
  }

  findAll() {
    return this.prisma.booking.findMany({
      include: { user: true, room: true },
      orderBy: { startTime: 'asc' },
    });
  }
}
