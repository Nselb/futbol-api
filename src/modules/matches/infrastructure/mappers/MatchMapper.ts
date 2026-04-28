import {
  EventType as PrismaEventType,
  Prisma,
  MatchStatus as PrismaMatchStatus,
} from '@prisma/client';
import { Match } from '../../domain/entities/Match';
import { TimeInterval } from '../../domain/entities/TimeInterval';
import { MatchEvent } from '../../domain/entities/MatchEvent';
import { MatchStatus } from '../../domain/enums/MatchStatus';
import { EventType } from '../../domain/enums/EventType';

export type PrismaMatchFull = Prisma.MatchGetPayload<{
  include: {
    timeIntervals: true;
    events: { include: { player: { select: { teamId: true } } } };
  };
}>;

export class MatchMapper {
  static toDomain(data: PrismaMatchFull): Match {
    const intervals = data.timeIntervals.map(
      (i) =>
        new TimeInterval(i.id, i.matchId, i.half, i.startedAt, i.stoppedAt),
    );

    const playerTeams = new Map<string, string>();
    const events = data.events.map((e) => {
      if (e.player.teamId) playerTeams.set(e.playerId, e.player.teamId);
      return new MatchEvent(
        e.id,
        e.matchId,
        e.playerId,
        MatchMapper.eventTypeToDomain(e.type),
        e.minute,
        e.half,
        e.createdAt,
        e.incomingPlayerId,
      );
    });

    return Match.reconstitute({
      id: data.id,
      homeTeamId: data.localTeamId,
      awayTeamId: data.awayTeamId,
      status: MatchMapper.statusToDomain(data.status),
      half: data.half,
      intervals,
      events,
      createdAt: data.createdAt,
      playerTeams,
    });
  }

  private static statusToDomain(status: PrismaMatchStatus): MatchStatus {
    return MatchStatus[status as keyof typeof MatchStatus];
  }

  static statusToPrisma(status: MatchStatus): PrismaMatchStatus {
    return PrismaMatchStatus[status as keyof typeof PrismaMatchStatus];
  }

  private static eventTypeToDomain(type: PrismaEventType): EventType {
    return EventType[type as keyof typeof EventType];
  }
}
