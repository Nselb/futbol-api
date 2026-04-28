import {
  ConflictException,
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
import { CreateTeamDto } from '../dtos/create-team.dto';
import { Team } from '../../domain/entities/Team';
import { Player } from 'src/modules/players/domain/entities/Player';
import { TeamMapper } from '../mappers/TeamMapper';

@Injectable()
export class UpdateTeamUseCase {
  constructor(
    @Inject(TEAM_REPO_TOKEN) private readonly teamRepository: ITeamRepository,
    @Inject(PLAYER_REPO_TOKEN)
    private readonly playerRepository: IPlayerRepository,
  ) {}

  async execute(teamId: string, dto: CreateTeamDto) {
    const team = await this.teamRepository.findById(teamId);
    if (!team) {
      throw new NotFoundException(`Team with id "${teamId}" not found`);
    }

    if (dto.name !== team.name) {
      const nameConflict = await this.teamRepository.findByName(dto.name);
      if (nameConflict) {
        throw new ConflictException(
          `Team with name "${dto.name}" already exists`,
        );
      }
    }

    const incomingNumbers = new Set(dto.players.map((p) => p.number));

    const removed = team.players.filter((p) => !incomingNumbers.has(p.number));
    await Promise.all(
      removed.map((p) => {
        p.teamId = null;
        return this.playerRepository.save(p);
      }),
    );

    const kept = team.players.filter((p) => incomingNumbers.has(p.number));
    const keptNumbers = new Set(kept.map((p) => p.number));

    const newPlayers = await Promise.all(
      dto.players
        .filter((p) => !keptNumbers.has(p.number))
        .map((p) => this.resolvePlayer(p.name, p.number, teamId)),
    );

    const updated = new Team(teamId, dto.name, [
      ...kept,
      ...newPlayers.filter((p) => p !== null),
    ]);

    await this.teamRepository.save(updated);

    return TeamMapper.toResponse(updated);
  }

  private async resolvePlayer(
    name: string,
    number: number,
    teamId: string,
  ): Promise<Player | null> {
    const existing = await this.playerRepository.findByNameAndNumber(
      name,
      number,
    );
    if (existing) {
      if (existing.teamId !== null) return null;
      existing.teamId = teamId;
      return existing;
    }
    return new Player(crypto.randomUUID(), name, number, teamId);
  }
}
