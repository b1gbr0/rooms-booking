import { IsDateString, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  name: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;
}
