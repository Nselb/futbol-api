import { Inject, Injectable } from '@nestjs/common';
import {
  type ITeamRepository,
  TEAM_REPO_TOKEN,
} from '../../domain/repository/ITeamRepository';
import { CreateTeamDto } from '../dtos/create-team.dto';
import { Team } from '../../domain/entities/Team';
import { Player } from 'src/modules/players/domain/entities/Player';
import { TeamMapper } from '../mappers/TeamMapper';

@Injectable()
export class CreateTeamUseCase {
  constructor(
    @Inject(TEAM_REPO_TOKEN) private readonly teamRepository: ITeamRepository,
  ) {}

  async execute(dto: CreateTeamDto) {
    const team = new Team(crypto.randomUUID(), dto.name, []);

    const players = dto.players.map(
      (p) => new Player(crypto.randomUUID(), p.name, p.number, team.id),
    );

    team.players.push(...players);

    await this.teamRepository.save(team);

    return TeamMapper.toResponse(team);
  }
}
