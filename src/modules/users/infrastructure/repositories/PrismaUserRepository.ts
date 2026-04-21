import { Injectable } from '@nestjs/common';
import { RoleMapper } from 'src/modules/roles/infrastructure/mappers/RoleMapper';
import { PrismaService } from 'src/shared/infrastructure/database/prisma.service';
import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { UserMapper } from '../mappers/UserMapper';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  async save(user: User): Promise<User> {
    const role = RoleMapper.toPrisma(user.role);

    const data = await this.prisma.user.upsert({
      where: { id: user.id },
      update: {
        name: user.name,
        role: role,
      },
      create: {
        id: user.id,
        username: user.username,
        password: user.password,
        name: user.name,
        role: role,
      },
    });

    return UserMapper.toDomain(data);
  }
  async findByUsername(username: string): Promise<User | null> {
    const data = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });
    return data ? UserMapper.toDomain(data) : null;
  }
  async findById(id: string): Promise<User | null> {
    const data = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    return data ? UserMapper.toDomain(data) : null;
  }
}
