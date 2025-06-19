import { IsString, IsInt, Min, IsOptional } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  name: string;

  @IsInt()
  @Min(1)
  capacity: number;

  @IsString()
  @IsOptional()
  location: string;
}
