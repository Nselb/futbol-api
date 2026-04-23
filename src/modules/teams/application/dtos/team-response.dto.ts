import { PlayerResponseDto } from 'src/modules/players/application/dtos/player-response.dto';

export class TeamResponseDto {
  constructor(
    readonly name: string,
    readonly id: string,
    readonly players: PlayerResponseDto[],
  ) {}
}
