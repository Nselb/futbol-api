import { PlayerStatus } from '../enums/PlayerStatus';

export class Player {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly number: number,
    public teamId: string | null,
    public status: PlayerStatus = PlayerStatus.BENCHED,
    readonly createdAt: Date = new Date(),
  ) {}

  assignTeam(teamId: string) {
    if (this.teamId !== null) {
      throw new Error('This player has a team already');
    }
    this.teamId = teamId;
  }
}
