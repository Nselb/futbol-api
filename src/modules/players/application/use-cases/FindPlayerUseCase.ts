import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  type IPlayerRepository,
  PLAYER_REPO_TOKEN,
} from '../../domain/repositories/IPlayerRepository';
import { PlayerMapper } from '../mappers/PlayerMapper';

@Injectable()
export class FindPlayerUseCase {
  constructor(
    @Inject(PLAYER_REPO_TOKEN)
    private readonly playerRepository: IPlayerRepository,
  ) {}

  async execute(id: string) {
    const player = await this.playerRepository.findById(id);

    if (!player) {
      throw new NotFoundException(`No player was found with id ${id}`);
    }

    return PlayerMapper.toResponse(player);
  }
}
