import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  type ITeamRepository,
  TEAM_REPO_TOKEN,
} from '../../domain/repository/ITeamRepository';
import { TeamMapper } from '../mappers/TeamMapper';
import { TeamResponseDto } from '../dtos/team-response.dto';

@Injectable()
export class SearchTeamByNameUseCase {
  constructor(
    @Inject(TEAM_REPO_TOKEN) private readonly teamRepository: ITeamRepository,
  ) {}

  async execute(name: string): Promise<TeamResponseDto> {
    const team = await this.teamRepository.findByName(name);
    if (!team) throw new NotFoundException('Team not found');
    return TeamMapper.toResponse(team);
  }
}
