import { Inject, Injectable } from '@nestjs/common';
import {
  type IMatchRepository,
  MATCH_REPO_TOKEN,
} from '../../domain/repositories/IMatchRepository';
import { MatchMapper } from '../mappers/MatchMapper';
import { MatchResponseDto } from '../dtos/match-response.dto';

@Injectable()
export class GetAllMatchesUseCase {
  constructor(
    @Inject(MATCH_REPO_TOKEN) private readonly repository: IMatchRepository,
  ) {}

  async execute(): Promise<MatchResponseDto[]> {
    const matches = await this.repository.findAll();
    return matches.map(MatchMapper.toResponse);
  }
}