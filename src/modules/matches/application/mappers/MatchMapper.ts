import { Match } from '../../domain/entities/Match';
import {
  MatchEventResponseDto,
  MatchResponseDto,
} from '../dtos/match-response.dto';

export class MatchMapper {
  static toResponse(match: Match): MatchResponseDto {
    return new MatchResponseDto(
      match.id,
      match.localTeamId,
      match.awayTeamId,
      match.status,
      match.half,
      match.elapsedSeconds(),
      match.activeInterval()?.startedAt ?? null,
      match.events.map(
        (e) =>
          new MatchEventResponseDto(
            e.id,
            e.playerId,
            e.type,
            e.minute,
            e.half,
            e.createdAt,
          ),
      ),
      match.createdAt,
    );
  }
}
