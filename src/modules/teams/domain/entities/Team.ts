import { Player } from 'src/modules/players/domain/entities/Player';

export class Team {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly players: Player[],
  ) {}

  addPlayer(player: Player) {
    if (player.teamId !== null) {
      throw new Error(`Player ${player.name} already belongs to a team`);
    }
    this.players.push(player);
  }
}
