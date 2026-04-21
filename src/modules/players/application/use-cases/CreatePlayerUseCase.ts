import { Inject, Injectable } from '@nestjs/common';
import { CreatePlayerDto } from '../dtos/create-player.dto';
import {
  type IPlayerRepository,
  PLAYER_REPO_TOKEN,
} from '../../domain/repositories/IPlayerRepository';
import { Player } from '../../domain/entities/Player';
import { PlayerStatus } from '../../domain/enums/PlayerStatus';
import { PlayerMapper } from '../mappers/PlayerMapper';

@Injectable()
export class CreatePlayerUseCase {
  constructor(
    @Inject(PLAYER_REPO_TOKEN)
    private readonly playerRepository: IPlayerRepository,
  ) {}

  async execute(dto: CreatePlayerDto) {
    const player = new Player(
      crypto.randomUUID(),
      dto.name,
      dto.number,
      null,
      PlayerStatus.BENCHED,
      new Date(),
    );
    await this.playerRepository.save(player);
    return PlayerMapper.toResponse(player);
  }
}
