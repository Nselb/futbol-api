import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { MatchResponseDto } from '../dtos/match-response.dto';
import {
  type IMatchRepository,
  MATCH_REPO_TOKEN,
} from '../../domain/repositories/IMatchRepository';
import { MatchMapper } from '../mappers/MatchMapper';

@Injectable()
export class HalfTimeUseCase {
  constructor(
    @Inject(MATCH_REPO_TOKEN) private readonly repository: IMatchRepository,
  ) {}

  async execute(matchId: string): Promise<MatchResponseDto> {
    const match = await this.repository.findById(matchId);
    if (!match) {
      throw new NotFoundException('Match not found');
    }
    match.halfTime();
    await this.repository.save(match);
    return MatchMapper.toResponse(match);
  }
}
