import { Type } from 'class-transformer';
import { IsString, MinLength, ValidateNested } from 'class-validator';
import { CreatePlayerDto } from 'src/modules/players/application/dtos/create-player.dto';

export class CreateTeamDto {
  @IsString()
  @MinLength(3)
  name: string;

  @ValidateNested({ each: true })
  @Type(() => CreatePlayerDto)
  players: CreatePlayerDto[];
}
