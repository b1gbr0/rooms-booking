import { IsString, IsInt, Min, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRoomDto {
  @IsString()
  @ApiProperty({
    description: 'Name of the room',
    example: 'Conference Room #5',
  })
  name: string;

  @IsInt()
  @Min(1)
  @ApiProperty({
    description: 'Capacity of the room (number of people)',
    example: 10,
    minimum: 1,
  })
  capacity: number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Location of the room (optional)',
    example: '2nd floor, Building A',
  })
  location: string;
}
