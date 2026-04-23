import { Inject, Injectable } from '@nestjs/common';
import {
  type IMatchRepository,
  MATCH_REPO_TOKEN,
} from '../../domain/repositories/IMatchRepository';
import { CreateMatchDto } from '../dtos/create-match.dto';
import { MatchResponseDto } from '../dtos/match-response.dto';
import { Match } from '../../domain/entities/Match';
import { MatchMapper } from '../mappers/MatchMapper';

@Injectable()
export class CreateMatchUseCase {
  constructor(
    @Inject(MATCH_REPO_TOKEN) private readonly repository: IMatchRepository,
  ) {}

  async execute(dto: CreateMatchDto): Promise<MatchResponseDto> {
    const match = Match.create(dto.homeTeamId, dto.awayTeamId);
    await this.repository.save(match);
    return MatchMapper.toResponse(match);
  }
}
