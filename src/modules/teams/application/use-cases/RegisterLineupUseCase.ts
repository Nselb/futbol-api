import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  type ITeamRepository,
  TEAM_REPO_TOKEN,
} from '../../domain/repository/ITeamRepository';
import {
  type IPlayerRepository,
  PLAYER_REPO_TOKEN,
} from 'src/modules/players/domain/repositories/IPlayerRepository';
import { PlayerStatus } from 'src/modules/players/domain/enums/PlayerStatus';
import { Player } from 'src/modules/players/domain/entities/Player';

@Injectable()
export class RegisterLineupUseCase {
  constructor(
    @Inject(TEAM_REPO_TOKEN) private readonly teamRepository: ITeamRepository,
    @Inject(PLAYER_REPO_TOKEN)
    private readonly playerRepository: IPlayerRepository,
  ) {}

  async execute(
    teamId: string,
    playerIds: string[],
  ): Promise<{ playerIds: string[] }> {
    if (playerIds.length !== 7) {
      throw new BadRequestException('Exactly 7 players are required');
    }

    const team = await this.teamRepository.findById(teamId);
    if (!team) throw new NotFoundException('Team not found');

    const fetched = await Promise.all(
      playerIds.map((id) => this.playerRepository.findById(id)),
    );

    const validatedPlayers: Player[] = [];

    for (const player of fetched) {
      if (!player) throw new NotFoundException('Player not found');
      if (player.teamId !== teamId) {
        throw new BadRequestException(
          `Player ${player.id} does not belong to this team`,
        );
      }
      if (player.status === PlayerStatus.PLAYING) {
        throw new BadRequestException(
          `Player ${player.id} is already playing`,
        );
      }
      validatedPlayers.push(player);
    }

    await Promise.all(
      validatedPlayers.map((player) => {
        player.play();
        return this.playerRepository.save(player);
      }),
    );

    return { playerIds };
  }
}
