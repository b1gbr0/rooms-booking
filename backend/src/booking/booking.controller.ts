import {
  Body,
  Controller,
  Post,
  Get,
  Req,
  Delete,
  Param,
  Query,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { Request } from 'express';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  async create(@Req() req: Request, @Body() dto: CreateBookingDto) {
    return await this.bookingService.createBooking(req.user!.userId, dto);
  }

  @Get('me')
  async findMyBookings(@Req() req: Request) {
    return await this.bookingService.findBookingsByUser(req.user!.userId);
  }

  @Get()
  @Roles(Role.ADMIN)
  async findAll(@Query('from') from?: string, @Query('to') to?: string) {
    return await this.bookingService.findAll({
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
    });
  }

  @Delete(':id')
  async delete(@Req() req: Request, @Param('id') id: string) {
    return await this.bookingService.deleteBooking(req.user!, id);
  }
}
