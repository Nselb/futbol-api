import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  type IMatchRepository,
  MATCH_REPO_TOKEN,
} from '../../domain/repositories/IMatchRepository';
import { MatchResponseDto } from '../dtos/match-response.dto';
import { MatchMapper } from '../mappers/MatchMapper';
import { MatchesGateway } from '../../infrastructure/gateways/matches.gateway';

@Injectable()
export class PauseMatchUseCase {
  constructor(
    @Inject(MATCH_REPO_TOKEN) private readonly repository: IMatchRepository,
    private gateway: MatchesGateway,
  ) {}

  async execute(matchId: string): Promise<MatchResponseDto> {
    const match = await this.repository.findById(matchId);
    if (!match) {
      throw new NotFoundException('Match not found');
    }

    match.pause();

    await this.repository.save(match);
    return MatchMapper.toResponse(match);
  }
}
