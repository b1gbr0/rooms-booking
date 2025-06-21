import {
  IsDateString,
  ValidateIf,
  IsUUID,
  IsString,
  IsNotEmpty,
} from 'class-validator';

export class CreateBookingDto {
  @ValidateIf((o: CreateBookingDto) => !o.roomName)
  @IsUUID()
  roomId?: string;

  @ValidateIf((o: CreateBookingDto) => !o.roomId)
  @IsString()
  @IsNotEmpty()
  roomName?: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;
}
