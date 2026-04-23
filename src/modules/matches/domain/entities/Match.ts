import { EventType } from '../enums/EventType';
import { MatchStatus } from '../enums/MatchStatus';
import { MatchEvent } from './MatchEvent';
import { TimeInterval } from './TimeInterval';

export class Match {
  constructor(
    readonly id: string,
    readonly localTeamId: string,
    readonly awayTeamId: string,
    public status: MatchStatus,
    public half: number,
    readonly intervals: TimeInterval[],
    readonly events: MatchEvent[],
    readonly createdAt: Date,
  ) {}

  start() {
    switch (this.status) {
      case MatchStatus.SCHEDULED:
        this.status = MatchStatus.IN_PROGRESS;
        this.half = 1;
        this._openInterval();
        break;
      case MatchStatus.PAUSED:
        this.status = MatchStatus.IN_PROGRESS;
        this._openInterval();
        break;
      case MatchStatus.HALF_TIME:
        this.status = MatchStatus.IN_PROGRESS;
        this.half = 2;
        this._openInterval();
        break;
      default:
        throw new Error(`Cannot start a match with status ${this.status}`);
    }
  }

  pause(): void {
    if (this.status !== MatchStatus.IN_PROGRESS) {
      throw new Error('Only an in-progress match can be paused');
    }
    this.status = MatchStatus.PAUSED;
    this._closeActiveInterval();
  }

  halfTime(): void {
    if (this.status !== MatchStatus.IN_PROGRESS || this.half !== 1) {
      throw new Error('Cannot end first half');
    }
    this.status = MatchStatus.HALF_TIME;
    this._closeActiveInterval();
  }

  finish(): void {
    if (this.status !== MatchStatus.IN_PROGRESS || this.half !== 2) {
      throw new Error('Cannot finish match - must be in second half');
    }
    this.status = MatchStatus.FINISHED;
    this._closeActiveInterval();
  }

  registerEvent(playerId: string, type: EventType, minute: number): MatchEvent {
    if (this.status !== MatchStatus.IN_PROGRESS) {
      throw new Error(
        'Events can only be registered while match is in progress',
      );
    }
    const event = new MatchEvent(
      crypto.randomUUID(),
      this.id,
      playerId,
      type,
      minute,
      this.half,
      new Date(),
    );
    this.events.push(event);
    return event;
  }

  elapsedSeconds(half?: number): number {
    const intervals = half
      ? this.intervals.filter((i) => i.half === half)
      : this.intervals;

    return Math.floor(
      intervals.reduce((total, i) => {
        const end = i.finishedAt ?? new Date();
        return total + (end.getTime() - i.startedAt.getTime());
      }, 0) / 1000,
    );
  }

  activeInterval(): TimeInterval | null {
    return this.intervals.find((i) => i.finishedAt === null) ?? null;
  }

  goalsFor(teamId: string): number {
    return this.events.filter(
      (e) =>
        e.type === EventType.GOAL &&
        e.playerId &&
        this._isFromTeam(e.playerId, teamId),
    ).length;
  }

  private _openInterval(): void {
    const interval = new TimeInterval(
      crypto.randomUUID(),
      this.id,
      this.half,
      new Date(),
      null,
    );
    this.intervals.push(interval);
  }

  private _closeActiveInterval(): void {
    const active = this.intervals.find((i) => i.finishedAt === null);
    if (active) {
      active.finishedAt = new Date();
    }
  }

  private _isFromTeam(_playerId: string, _teamId: string): boolean {
    return true;
  }

  static create(homeTeamId: string, awayTeamId: string): Match {
    return new Match(
      crypto.randomUUID(),
      homeTeamId,
      awayTeamId,
      MatchStatus.SCHEDULED,
      1,
      [],
      [],
      new Date(),
    );
  }

  static reconstitute(data: {
    id: string;
    homeTeamId: string;
    awayTeamId: string;
    status: MatchStatus;
    half: number;
    intervals: TimeInterval[];
    events: MatchEvent[];
    createdAt: Date;
  }): Match {
    return new Match(
      data.id,
      data.homeTeamId,
      data.awayTeamId,
      data.status,
      data.half,
      data.intervals,
      data.events,
      data.createdAt,
    );
  }
}
