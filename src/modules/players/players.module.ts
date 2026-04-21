import { Module } from '@nestjs/common';
import { CreatePlayerUseCase } from './application/use-cases/CreatePlayerUseCase';
import { PLAYER_REPO_TOKEN } from './domain/repositories/IPlayerRepository';
import { PrismaPlayerRepository } from './infrastructure/repository/PrismaPlayerRepository';
import { PlayersController } from './presentation/players.controller';
import { FindPlayerUseCase } from './application/use-cases/FindPlayerUseCase';

@Module({
  controllers: [PlayersController],
  providers: [
    CreatePlayerUseCase,
    FindPlayerUseCase,
    { provide: PLAYER_REPO_TOKEN, useClass: PrismaPlayerRepository },
  ],
  exports: [PLAYER_REPO_TOKEN],
})
export class PlayersModule {}
