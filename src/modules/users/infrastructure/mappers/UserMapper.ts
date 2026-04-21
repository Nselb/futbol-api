import { User as PrismaUser } from '@prisma/client';
import { RoleMapper } from 'src/modules/roles/infrastructure/mappers/RoleMapper';
import { User } from '../../domain/entities/User';

export class UserMapper {
  static toDomain(user: PrismaUser): User {
    return new User(
      user.id,
      user.username,
      user.password,
      user.name,
      RoleMapper.toDomain(user.role),
      user.createdAt,
    );
  }

  static toPrisma(user: User): PrismaUser {
    return {
      name: user.name,
      id: user.id,
      username: user.username,
      password: user.password,
      role: RoleMapper.toPrisma(user.role),
      createdAt: user.createdAt,
    };
  }
}
