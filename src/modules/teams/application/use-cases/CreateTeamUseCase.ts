import { ConflictException, Inject, Injectable } from '@nestjs/common';
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
export class CreateTeamUseCase {
  constructor(
    @Inject(TEAM_REPO_TOKEN) private readonly teamRepository: ITeamRepository,
    @Inject(PLAYER_REPO_TOKEN)
    private readonly playerRepository: IPlayerRepository,
  ) {}

  async execute(dto: CreateTeamDto) {
    const existing = await this.teamRepository.findByName(dto.name);
    if (existing) {
      throw new ConflictException(
        `Team with name "${dto.name}" already exists`,
      );
    }

    const team = new Team(crypto.randomUUID(), dto.name, []);

    const players = await Promise.all(
      dto.players.map((p) => this.resolvePlayer(p.name, p.number, team.id)),
    );

    team.players.push(...players.filter((p) => p !== null));

    await this.teamRepository.save(team);

    return TeamMapper.toResponse(team);
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
      existing.teamId = teamId;
      return existing;
    }
    return new Player(crypto.randomUUID(), name, number, teamId);
  }
}
