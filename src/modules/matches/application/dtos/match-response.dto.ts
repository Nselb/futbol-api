export class MatchResponseDto {
  constructor(
    readonly id: string,
    readonly homeTeamId: string,
    readonly awayTeamId: string,
    readonly status: string,
    readonly half: number,
    readonly elapsedSeconds: number,
    readonly activeIntervalStartedAt: Date | null,
    readonly events: MatchEventResponseDto[],
    readonly createdAt: Date,
  ) {}
}

export class MatchEventResponseDto {
  constructor(
    readonly id: string,
    readonly playerId: string,
    readonly type: string,
    readonly minute: number,
    readonly half: number,
    readonly createdAt: Date,
  ) {}
}
