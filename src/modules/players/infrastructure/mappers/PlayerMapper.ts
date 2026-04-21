import { Player } from '../../domain/entities/Player';
import { Player as PrismaPlayer } from '@prisma/client';
import { PlayerStatusMapper } from './PlayerStatusMapper';

export class PlayerMapper {
  static toDomain(player: PrismaPlayer): Player {
    return new Player(
      player.id,
      player.name,
      player.number,
      player.teamId,
      PlayerStatusMapper.toDomain(player.status),
      player.createdAt,
    );
  }
}
