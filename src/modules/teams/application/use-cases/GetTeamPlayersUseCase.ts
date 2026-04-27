import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  type ITeamRepository,
  TEAM_REPO_TOKEN,
} from '../../domain/repository/ITeamRepository';
import {
  type IPlayerRepository,
  PLAYER_REPO_TOKEN,
} from 'src/modules/players/domain/repositories/IPlayerRepository';

@Injectable()
export class GetTeamPlayersUseCase {
  constructor(
    @Inject(TEAM_REPO_TOKEN) private readonly teamRepository: ITeamRepository,
    @Inject(PLAYER_REPO_TOKEN)
    private readonly playerRepository: IPlayerRepository,
  ) {}

  async execute(teamId: string): Promise<{ playerIds: string[] }> {
    const team = await this.teamRepository.findById(teamId);
    if (!team) throw new NotFoundException('Team not found');

    const players = await this.playerRepository.findByTeam(teamId);
    return { playerIds: players.map((p) => p.id) };
  }
}
