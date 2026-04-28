import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';
import { EventType } from '../../domain/enums/EventType';

export class RegisterEventDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @IsUUID()
  playerId: string;

  @ApiProperty({ enum: EventType, example: EventType.GOAL })
  @IsEnum(EventType)
  type: EventType;

  @ApiProperty({ example: 45, minimum: 0, maximum: 120 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(120)
  minute?: number;

  @ApiPropertyOptional({ example: 'b2c3d4e5-f6a7-8901-bcde-f12345678901' })
  @IsOptional()
  @IsUUID()
  incomingPlayerId?: string;
}
