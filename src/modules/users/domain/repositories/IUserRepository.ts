import { User } from '../entities/User';

export const USER_REPO_TOKEN = Symbol('IUserRepository');

export interface IUserRepository {
  save(user: User): Promise<User>;
  findByUsername(username: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
}
