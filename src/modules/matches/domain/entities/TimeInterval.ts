export class TimeInterval {
  constructor(
    public id: string,
    public matchId: string,
    public half: number,
    public startedAt: Date,
    public finishedAt: Date | null,
  ) {}
}
