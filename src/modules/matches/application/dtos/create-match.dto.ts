import { IsUUID } from 'class-validator';

export class CreateMatchDto {
  @IsUUID()
  homeTeamId: string;

  @IsUUID()
  awayTeamId: string;
}
