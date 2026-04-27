import { Inject, Injectable } from '@nestjs/common';
import {
  type ITeamRepository,
  TEAM_REPO_TOKEN,
} from '../../domain/repository/ITeamRepository';
import { TeamMapper } from '../mappers/TeamMapper';
import { TeamResponseDto } from '../dtos/team-response.dto';

@Injectable()
export class GetAllTeamsUseCase {
  constructor(
    @Inject(TEAM_REPO_TOKEN) private readonly teamRepository: ITeamRepository,
  ) {}

  async execute(): Promise<TeamResponseDto[]> {
    const teams = await this.teamRepository.findAll();
    return teams.map(TeamMapper.toResponse);
  }
}