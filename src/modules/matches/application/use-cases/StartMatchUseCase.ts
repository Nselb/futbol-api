import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  type IMatchRepository,
  MATCH_REPO_TOKEN,
} from '../../domain/repositories/IMatchRepository';
import { MatchResponseDto } from '../dtos/match-response.dto';
import { MatchMapper } from '../mappers/MatchMapper';
import { MatchesGateway } from '../../infrastructure/gateways/matches.gateway';

@Injectable()
export class StartMatchUseCase {
  constructor(
    @Inject(MATCH_REPO_TOKEN) private readonly repository: IMatchRepository,
    private readonly gateway: MatchesGateway,
  ) {}

  async execute(matchId: string): Promise<MatchResponseDto> {
    const match = await this.repository.findById(matchId);
    if (!match) {
      throw new NotFoundException('Match not found');
    }

    match.start();

    await this.repository.save(match);

    Logger.log(match);
    const response = MatchMapper.toResponse(match);
    this.gateway.emitMatchUpdated(matchId, response);
    return response;
  }
}
