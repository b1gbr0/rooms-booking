import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('rooms')
@ApiBearerAuth('access-token')
@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get()
  @ApiOperation({ summary: 'Get list of all rooms' })
  @ApiResponse({ status: 200, description: 'List of rooms returned.' })
  findAll() {
    return this.roomService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a room by ID' })
  @ApiParam({ name: 'id', description: 'Room ID', example: 'uuid-room-id' })
  @ApiResponse({ status: 200, description: 'Room found.' })
  @ApiResponse({ status: 404, description: 'Room not found.' })
  findOne(@Param('id') id: string) {
    return this.roomService.findById(id);
  }

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new room (admin only)' })
  @ApiResponse({ status: 201, description: 'Room created successfully.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.create(createRoomDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a room by ID (admin only)' })
  @ApiParam({ name: 'id', description: 'Room ID', example: 'uuid-room-id' })
  @ApiResponse({ status: 200, description: 'Room deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Room not found.' })
  remove(@Param('id') id: string) {
    return this.roomService.remove(id);
  }
}
