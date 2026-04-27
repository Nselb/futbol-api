import { IsArray, IsUUID, ArrayMinSize, ArrayMaxSize } from 'class-validator';

export class RegisterLineupDto {
  @IsArray()
  @IsUUID('4', { each: true })
  @ArrayMinSize(7)
  @ArrayMaxSize(7)
  playerIds: string[];
}
