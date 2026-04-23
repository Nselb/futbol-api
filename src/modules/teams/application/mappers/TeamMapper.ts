import { PlayerResponseDto } from 'src/modules/players/application/dtos/player-response.dto';
import { Team } from '../../domain/entities/Team';
import { TeamResponseDto } from '../dtos/team-response.dto';

export class TeamMapper {
  static toResponse(team: Team): TeamResponseDto {
    const players = team.players.map(
      (p) => new PlayerResponseDto(p.id, p.name, p.number),
    );
    return new TeamResponseDto(team.id, team.name, players);
  }
}
