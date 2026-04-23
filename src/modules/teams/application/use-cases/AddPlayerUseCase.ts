import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  type IPlayerRepository,
  PLAYER_REPO_TOKEN,
} from 'src/modules/players/domain/repositories/IPlayerRepository';
import { AddPlayerDto } from '../dtos/add-player.dto';
import { TeamResponseDto } from '../dtos/team-response.dto';
import {
  type ITeamRepository,
  TEAM_REPO_TOKEN,
} from '../../domain/repository/ITeamRepository';
import { TeamMapper } from '../mappers/TeamMapper';

@Injectable()
export class AddPlayerUseCase {
  constructor(
    @Inject(TEAM_REPO_TOKEN) private readonly teamRepository: ITeamRepository,
    @Inject(PLAYER_REPO_TOKEN)
    private readonly playerRepository: IPlayerRepository,
  ) {}

  async execute(dto: AddPlayerDto): Promise<TeamResponseDto> {
    const team = await this.teamRepository.findById(dto.teamId);
    if (!team) {
      throw new NotFoundException('Team not found');
    }

    const player = await this.playerRepository.findById(dto.playerId);
    if (!player) {
      throw new NotFoundException('Player not found');
    }

    team.addPlayer(player);

    await this.teamRepository.save(team);

    return TeamMapper.toResponse(team);
  }
}
