import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [RoomService],
  imports: [PrismaModule],
  controllers: [RoomController],
})
export class RoomModule {}
