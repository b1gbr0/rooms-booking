import { Body, Controller, Post, Get, Req } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { Request } from 'express';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  create(@Req() req: Request, @Body() dto: CreateBookingDto) {
    return this.bookingService.createBooking(req.user!.userId, dto);
  }

  @Get('me')
  findMyBookings(@Req() req: Request) {
    return this.bookingService.findBookingsByUser(req.user!.userId);
  }

  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.bookingService.findAll();
  }
}
