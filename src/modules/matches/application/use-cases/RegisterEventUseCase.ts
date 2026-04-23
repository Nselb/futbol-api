import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  type IMatchRepository,
  MATCH_REPO_TOKEN,
} from '../../domain/repositories/IMatchRepository';
import { MatchResponseDto } from '../dtos/match-response.dto';
import { RegisterEventDto } from '../dtos/register-event.dto';
import { MatchMapper } from '../mappers/MatchMapper';

@Injectable()
export class RegisterEventUseCase {
  constructor(@Inject(MATCH_REPO_TOKEN) private repository: IMatchRepository) {}

  async execute(
    matchId: string,
    dto: RegisterEventDto,
  ): Promise<MatchResponseDto> {
    const match = await this.repository.findById(matchId);
    if (!match) throw new NotFoundException('Match not found');

    match.registerEvent(dto.playerId, dto.type, dto.minute);

    await this.repository.save(match);
    return MatchMapper.toResponse(match);
  }
}
