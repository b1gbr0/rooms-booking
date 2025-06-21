import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  ValidateIf,
  IsUUID,
  IsString,
  IsNotEmpty,
} from 'class-validator';

export class CreateBookingDto {
  @ApiPropertyOptional({
    description:
      'UUID of the room. Either roomId or roomName must be provided.',
    example: 'a3eeb1c9-5d72-4f77-9e9e-123456789abc',
  })
  @ValidateIf((o: CreateBookingDto) => !o.roomName)
  @IsUUID()
  roomId?: string;

  @ApiPropertyOptional({
    description:
      'Name of the room. Either roomName or roomId must be provided.',
    example: 'Conference Room #5',
  })
  @ValidateIf((o: CreateBookingDto) => !o.roomId)
  @IsString()
  @IsNotEmpty()
  roomName?: string;

  @ApiProperty({
    description: 'Booking start time in ISO 8601 format',
    example: '2025-06-21T10:00:00Z',
  })
  @IsDateString()
  startTime: string;

  @ApiProperty({
    description: 'Booking end time in ISO 8601 format',
    example: '2025-06-21T12:00:00Z',
  })
  @IsDateString()
  endTime: string;
}
