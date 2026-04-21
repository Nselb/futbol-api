import { Role as PrismaRole } from '@prisma/client';
import { Role } from '../../domain/enums/Role';

export class RoleMapper {
  static toDomain(role: PrismaRole): Role {
    return Role[role as keyof typeof Role];
  }

  static toPrisma(role: Role): PrismaRole {
    return PrismaRole[role as keyof typeof PrismaRole];
  }
}
