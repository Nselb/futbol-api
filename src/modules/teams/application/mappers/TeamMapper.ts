import { Team } from '../../domain/entities/Team';
import { TeamResponseDto } from '../dtos/team-response.dto';

export class TeamMapper {
  static toResponse(team: Team): TeamResponseDto {
    return new TeamResponseDto(team.name, team.id, team.players);
  }
}
