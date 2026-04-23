import { EventType } from '../enums/EventType';

export class MatchEvent {
  constructor(
    public id: string,
    public matchId: string,
    public playerId: string,
    public type: EventType,
    public minute: number,
    public half: number,
    public createdAt: Date,
  ) {}
}
