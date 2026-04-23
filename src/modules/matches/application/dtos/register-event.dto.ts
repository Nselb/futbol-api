import { IsEnum, IsInt, IsUUID, Max, Min } from 'class-validator';
import { EventType } from '../../domain/enums/EventType';

export class RegisterEventDto {
  @IsUUID()
  playerId: string;

  @IsEnum(EventType)
  type: EventType;

  @IsInt()
  @Min(1)
  @Max(120)
  minute: number;
}
