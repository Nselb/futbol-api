import { PlayerStatus as PrismaPlayerStatus } from '@prisma/client';
import { PlayerStatus } from '../../domain/enums/PlayerStatus';

export class PlayerStatusMapper {
  static toDomain(playerStatus: PrismaPlayerStatus): PlayerStatus {
    return PlayerStatus[playerStatus as keyof typeof PrismaPlayerStatus];
  }

  static toPrisma(playerStatus: PlayerStatus): PrismaPlayerStatus {
    return PrismaPlayerStatus[playerStatus as keyof typeof PlayerStatus];
  }
}
