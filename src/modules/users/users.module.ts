import { Module } from '@nestjs/common';
import { CreateUserUseCase } from './application/use-cases/CreateUserUseCase';
import { USER_REPO_TOKEN } from './domain/repositories/IUserRepository';
import { PrismaUserRepository } from './infrastructure/repositories/PrismaUserRepository';
import { UsersController } from './presentation/users.controller';

@Module({
  controllers: [UsersController],
  providers: [
    CreateUserUseCase,
    { provide: USER_REPO_TOKEN, useClass: PrismaUserRepository },
  ],
  exports: [USER_REPO_TOKEN],
})
export class UsersModule {}
