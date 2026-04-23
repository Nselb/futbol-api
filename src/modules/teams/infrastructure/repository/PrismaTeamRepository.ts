import { Injectable } from '@nestjs/common';
import { ITeamRepository } from '../../domain/repository/ITeamRepository';
import { Team } from '../../domain/entities/Team';
import { PrismaService } from 'src/shared/infrastructure/database/prisma.service';
import { TeamMapper } from '../mappers/TeamMapper';

@Injectable()
export class PrismaTeamRepository implements ITeamRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(team: Team): Promise<Team> {
    await this.prisma.$transaction(async (tx) => {
      await tx.team.upsert({
        where: { id: team.id },
        update: { name: team.name },
        create: { id: team.id, name: team.name },
      });
      if (team.players.length > 0) {
        await tx.player.updateMany({
          where: { id: { in: team.players.map((p) => p.id) } },
          data: { teamId: team.id },
        });
      }
    });
    return team;
  }

  async findById(teamId: string): Promise<Team | null> {
    const data = await this.prisma.team.findUnique({
      where: { id: teamId },
      include: { players: true },
    });
    return data ? TeamMapper.toDomain(data) : null;
  }
}
