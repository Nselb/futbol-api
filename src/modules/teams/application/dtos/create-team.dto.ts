import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, MinLength, ValidateNested } from 'class-validator';
import { CreatePlayerDto } from 'src/modules/players/application/dtos/create-player.dto';

export class CreateTeamDto {
  @ApiProperty({ example: 'Real Madrid' })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({ type: [CreatePlayerDto] })
  @ValidateNested({ each: true })
  @Type(() => CreatePlayerDto)
  players: CreatePlayerDto[];
}
