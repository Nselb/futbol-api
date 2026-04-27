import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/infrastructure/database/prisma.service';
import { Player } from '../../domain/entities/Player';
import { IPlayerRepository } from '../../domain/repositories/IPlayerRepository';
import { PlayerMapper } from '../mappers/PlayerMapper';
import { PlayerStatusMapper } from '../mappers/PlayerStatusMapper';

@Injectable()
export class PrismaPlayerRepository implements IPlayerRepository {
  constructor(private readonly prisma: PrismaService) {}
  async save(player: Player): Promise<Player> {
    const data = await this.prisma.player.upsert({
      where: { id: player.id },
      update: {
        name: player.name,
        number: player.number,
        status: PlayerStatusMapper.toPrisma(player.status),
        teamId: player.teamId,
      },
      create: {
        id: player.id,
        name: player.name,
        number: player.number,
        status: PlayerStatusMapper.toPrisma(player.status),
        teamId: player.teamId,
      },
    });
    return PlayerMapper.toDomain(data);
  }

  async findById(id: string): Promise<Player | null> {
    const data = await this.prisma.player.findUnique({ where: { id } });
    return data ? PlayerMapper.toDomain(data) : null;
  }

  async findByTeam(teamId: string): Promise<Player[]> {
    const data = await this.prisma.player.findMany({ where: { teamId } });
    return data.map((p) => PlayerMapper.toDomain(p));
  }
}
