import { ApiProperty } from '@nestjs/swagger';
import { PlayerResponseDto } from 'src/modules/players/application/dtos/player-response.dto';

export class TeamResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  readonly id: string;

  @ApiProperty({ example: 'Real Madrid' })
  readonly name: string;

  @ApiProperty({ type: [PlayerResponseDto] })
  readonly players: PlayerResponseDto[];

  constructor(id: string, name: string, players: PlayerResponseDto[]) {
    this.id = id;
    this.name = name;
    this.players = players;
  }
}
