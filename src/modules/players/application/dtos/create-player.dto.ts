import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsString, MinLength } from 'class-validator';

export class CreatePlayerDto {
  @ApiProperty({ example: 'Lionel Messi' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @IsPositive()
  number: number;
}
