import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  type IMatchRepository,
  MATCH_REPO_TOKEN,
} from '../../domain/repositories/IMatchRepository';
import { MatchMapper } from '../mappers/MatchMapper';
import { MatchResponseDto } from '../dtos/match-response.dto';
import { MatchesGateway } from '../../infrastructure/gateways/matches.gateway';

@Injectable()
export class FinishMatchUseCase {
  constructor(
    @Inject(MATCH_REPO_TOKEN) private repository: IMatchRepository,
    private gateway: MatchesGateway,
  ) {}

  async execute(matchId: string): Promise<MatchResponseDto> {
    const match = await this.repository.findById(matchId);

    if (!match) throw new NotFoundException('Match not found');

    match.finish();

    await this.repository.save(match);
    const response = MatchMapper.toResponse(match);
    this.gateway.emitMatchUpdated(matchId, response);
    return response;
  }
}
