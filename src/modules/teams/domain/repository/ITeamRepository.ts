import { Team } from '../entities/Team';

export const TEAM_REPO_TOKEN = Symbol('TEAM_REPO_TOKEN');

export interface ITeamRepository {
  save(team: Team): Promise<Team>;
  findById(teamId: string): Promise<Team | null>;
  findByName(name: string): Promise<Team | null>;
  findAll(): Promise<Team[]>;
}
