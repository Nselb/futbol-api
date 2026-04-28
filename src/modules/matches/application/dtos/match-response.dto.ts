import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MatchEventResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  readonly id: string;

  @ApiProperty({ example: 'b2c3d4e5-f6a7-8901-bcde-f12345678901' })
  readonly playerId: string;

  @ApiProperty({ example: 'GOAL' })
  readonly type: string;

  @ApiProperty({ example: 45 })
  readonly minute: number;

  @ApiProperty({ example: 1 })
  readonly half: number;

  @ApiProperty({ example: '2026-04-27T15:00:00.000Z' })
  readonly createdAt: Date;

  @ApiPropertyOptional({ example: 'c3d4e5f6-a7b8-9012-cdef-123456789012' })
  readonly incomingPlayerId: string | null;

  constructor(
    id: string,
    playerId: string,
    type: string,
    minute: number,
    half: number,
    createdAt: Date,
    incomingPlayerId: string | null,
  ) {
    this.id = id;
    this.playerId = playerId;
    this.type = type;
    this.minute = minute;
    this.half = half;
    this.createdAt = createdAt;
    this.incomingPlayerId = incomingPlayerId;
  }
}

export class MatchResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  readonly id: string;

  @ApiProperty({ example: 'b2c3d4e5-f6a7-8901-bcde-f12345678901' })
  readonly homeTeamId: string;

  @ApiProperty({ example: 'c3d4e5f6-a7b8-9012-cdef-123456789012' })
  readonly awayTeamId: string;

  @ApiProperty({ example: 'SCHEDULED' })
  readonly status: string;

  @ApiProperty({ example: 1 })
  readonly half: number;

  @ApiProperty({ example: 0 })
  readonly elapsedSeconds: number;

  @ApiPropertyOptional({ example: '2026-04-27T15:00:00.000Z' })
  readonly activeIntervalStartedAt: Date | null;

  @ApiProperty({ type: [MatchEventResponseDto] })
  readonly events: MatchEventResponseDto[];

  @ApiProperty({ example: '2026-04-27T14:00:00.000Z' })
  readonly createdAt: Date;

  constructor(
    id: string,
    homeTeamId: string,
    awayTeamId: string,
    status: string,
    half: number,
    elapsedSeconds: number,
    activeIntervalStartedAt: Date | null,
    events: MatchEventResponseDto[],
    createdAt: Date,
  ) {
    this.id = id;
    this.homeTeamId = homeTeamId;
    this.awayTeamId = awayTeamId;
    this.status = status;
    this.half = half;
    this.elapsedSeconds = elapsedSeconds;
    this.activeIntervalStartedAt = activeIntervalStartedAt;
    this.events = events;
    this.createdAt = createdAt;
  }
}
