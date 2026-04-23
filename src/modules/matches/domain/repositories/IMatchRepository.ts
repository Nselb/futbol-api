import { Match } from '../entities/Match';

export const MATCH_REPO_TOKEN = Symbol('IMatchRepository');

export interface IMatchRepository {
  save(match: Match): Promise<Match>;
  findById(id: string): Promise<Match | null>;
  findAll(): Promise<Match[]>;
}
