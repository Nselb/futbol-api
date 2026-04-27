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
      for (const player of team.players) {
        await tx.player.upsert({
          where: { id: player.id },
          update: { teamId: team.id },
          create: {
            id: player.id,
            name: player.name,
            number: player.number,
            teamId: team.id,
            status: player.status,
          },
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

  async findAll(): Promise<Team[]> {
    const data = await this.prisma.team.findMany({
      include: { players: true },
      orderBy: { createdAt: 'desc' },
    });
    return data.map(TeamMapper.toDomain);
  }
}
