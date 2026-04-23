import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/infrastructure/database/prisma.service';
import { Match } from '../../domain/entities/Match';
import { IMatchRepository } from '../../domain/repositories/IMatchRepository';
import { MatchMapper } from '../mappers/MatchMapper';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaMatchRepository implements IMatchRepository {
  constructor(private prisma: PrismaService) {}

  private get include(): Prisma.MatchInclude {
    return { timeIntervals: true, events: true };
  }

  async save(match: Match): Promise<Match> {
    await this.prisma.$transaction(async (tx) => {
      await tx.match.upsert({
        where: { id: match.id },
        update: {
          status: MatchMapper.statusToPrisma(match.status),
          half: match.half,
        },
        create: {
          id: match.id,
          localTeamId: match.localTeamId,
          awayTeamId: match.awayTeamId,
          status: MatchMapper.statusToPrisma(match.status),
          half: match.half,
          createdAt: match.createdAt,
        },
      });
      for (const interval of match.intervals) {
        await tx.timeInterval.upsert({
          where: { id: interval.id },
          update: { stoppedAt: interval.finishedAt },
          create: {
            id: interval.id,
            matchId: match.id,
            half: interval.half,
            startedAt: interval.startedAt,
            stoppedAt: interval.finishedAt,
          },
        });
      }

      for (const event of match.events) {
        await tx.eventMatch.upsert({
          where: { id: event.id },
          update: {},
          create: {
            id: event.id,
            matchId: match.id,
            playerId: event.playerId,
            type: event.type,
            minute: event.minute,
            half: event.half,
            createdAt: event.createdAt,
          },
        });
      }
    });

    return match;
  }

  async findById(id: string): Promise<Match | null> {
    const data = await this.prisma.match.findUnique({
      where: { id },
      include: this.include,
    });

    return data ? MatchMapper.toDomain(data) : null;
  }

  async findAll(): Promise<Match[]> {
    const data = await this.prisma.match.findMany({
      include: this.include,
      orderBy: { createdAt: 'desc' },
    });

    return data.map((d) => MatchMapper.toDomain(d));
  }
}
