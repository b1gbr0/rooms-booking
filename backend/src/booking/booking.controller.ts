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

import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('bookings')
@ApiBearerAuth('access-token')
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({ status: 201, description: 'Booking successfully created.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  async create(@Req() req: Request, @Body() dto: CreateBookingDto) {
    return await this.bookingService.createBooking(req.user!.userId, dto);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get bookings of the authenticated user' })
  @ApiResponse({ status: 200, description: 'List of user bookings returned.' })
  async findMyBookings(@Req() req: Request) {
    return await this.bookingService.findBookingsByUser(req.user!.userId);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all bookings (admin only)' })
  @ApiQuery({
    name: 'from',
    required: false,
    description: 'Filter bookings from this date (ISO string)',
    example: '2025-06-01',
  })
  @ApiQuery({
    name: 'to',
    required: false,
    description: 'Filter bookings up to this date (ISO string)',
    example: '2025-06-30',
  })
  @ApiResponse({ status: 200, description: 'List of all bookings returned.' })
  async findAll(@Query('from') from?: string, @Query('to') to?: string) {
    return await this.bookingService.findAll({
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a booking by ID' })
  @ApiParam({
    name: 'id',
    description: 'Booking ID to delete',
    example: 'uuid-booking-id',
  })
  @ApiResponse({ status: 200, description: 'Booking deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Booking not found.' })
  async delete(@Req() req: Request, @Param('id') id: string) {
    return await this.bookingService.deleteBooking(req.user!, id);
  }
}
