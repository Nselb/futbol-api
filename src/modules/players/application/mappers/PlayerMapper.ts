import { Player } from '../../domain/entities/Player';
import { PlayerResponseDto } from '../dtos/player-response.dto';

export class PlayerMapper {
  static toResponse(player: Player): PlayerResponseDto {
    return new PlayerResponseDto(
      player.id,
      player.name,
      player.number,
      player.status,
    );
  }
}
