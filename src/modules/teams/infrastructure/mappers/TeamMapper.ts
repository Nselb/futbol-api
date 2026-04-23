import { Prisma } from '@prisma/client';
import { PlayerMapper } from 'src/modules/players/infrastructure/mappers/PlayerMapper';
import { Team } from '../../domain/entities/Team';

type PrismaTeamWithPlayers = Prisma.TeamGetPayload<{
  include: { players: true };
}>;

export class TeamMapper {
  static toDomain(team: PrismaTeamWithPlayers): Team {
    const players = team.players.map((p) => PlayerMapper.toDomain(p));
    return new Team(team.id, team.name, players);
  }
}
