import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  type IMatchRepository,
  MATCH_REPO_TOKEN,
} from '../../domain/repositories/IMatchRepository';
import { MatchMapper } from '../mappers/MatchMapper';
import { MatchResponseDto } from '../dtos/match-response.dto';

@Injectable()
export class FinishMatchUseCase {
  constructor(@Inject(MATCH_REPO_TOKEN) private repository: IMatchRepository) {}

  async execute(matchId: string): Promise<MatchResponseDto> {
    const match = await this.repository.findById(matchId);

    if (!match) throw new NotFoundException('Match not found');

    match.finish();

    await this.repository.save(match);
    return MatchMapper.toResponse(match);
  }
}
