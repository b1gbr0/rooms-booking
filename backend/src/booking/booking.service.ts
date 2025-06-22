import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Prisma, Role } from '@prisma/client';
import { UsersService } from '../users/users.service';

interface BookingFilterOptions {
  from?: Date;
  to?: Date;
}

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async createBooking(userId: string, dto: CreateBookingDto) {
    let roomId = dto.roomId;
    const { roomName, startTime, endTime } = dto;

    // Validate room existence
    if (!roomId && !roomName) {
      throw new BadRequestException(
        'Either roomId or roomName must be provided',
      );
    }

    if (!roomId && roomName) {
      const room = await this.prisma.room.findUnique({
        where: { name: dto.roomName },
      });
      if (!room) {
        throw new NotFoundException(
          `Room with name "${dto.roomName}" not found`,
        );
      }
      roomId = room.id;
    }

    if (new Date(startTime) >= new Date(endTime)) {
      throw new BadRequestException('End time must be after start time');
    }

    if (new Date(startTime) < new Date()) {
      throw new BadRequestException('Cannot create booking in the past');
    }

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

    return await this.prisma.booking.create({
      data: {
        userId,
        roomId: roomId ?? '',
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      },
    });
  }

  async findBookingsByUser(userId: string, filter: BookingFilterOptions = {}) {
    return await this.prisma.booking.findMany({
      where: { ...this.makeFilter(filter), userId },
      include: { room: true },
      orderBy: { startTime: 'asc' },
    });
  }

  async findAll(filter: BookingFilterOptions = {}) {
    return await this.prisma.booking.findMany({
      where: this.makeFilter(filter),
      include: {
        user: {
          select: UsersService.safeUserSelect,
        },
        room: true,
      },
      orderBy: { startTime: 'asc' },
    });
  }

  async deleteBooking(user: { userId: string; role: Role }, bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const isOwner = booking.userId === user.userId;
    const isAdmin = user.role === Role.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException(
        'You are not allowed to delete this booking',
      );
    }

    await this.prisma.booking.delete({
      where: { id: bookingId },
    });

    return { message: 'Booking cancelled successfully' };
  }

  private makeFilter(filter: BookingFilterOptions): Prisma.BookingWhereInput {
    const where: Prisma.BookingWhereInput = {};
    if (
      filter.from &&
      filter.to &&
      new Date(filter.to) < new Date(filter.from)
    ) {
      const temp = filter.from;
      filter.from = filter.to;
      filter.to = temp;
    }
    if (filter.from) {
      where.startTime = { gte: new Date(filter.from) };
    }
    if (filter.to) {
      where.endTime = { lte: new Date(filter.to) };
    }
    return where;
  }
}
