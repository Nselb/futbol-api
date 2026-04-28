import { Player } from '../entities/Player';

export const PLAYER_REPO_TOKEN = Symbol('PLAYER_REPO_TOKEN');

export interface IPlayerRepository {
  save(player: Player): Promise<Player>;
  findById(id: string): Promise<Player | null>;
  findByTeam(teamId: string): Promise<Player[]>;
  findByNameAndNumber(name: string, number: number): Promise<Player | null>;
}
