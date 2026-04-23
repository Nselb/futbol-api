import { Module } from '@nestjs/common';
import { AddPlayerUseCase } from './application/use-cases/AddPlayerUseCase';
import { TEAM_REPO_TOKEN } from './domain/repository/ITeamRepository';
import { PrismaTeamRepository } from './infrastructure/repository/PrismaTeamRepository';
import { TeamsController } from './presentation/teams.controller';
import { PlayersModule } from '../players/players.module';

@Module({
  imports: [PlayersModule],
  controllers: [TeamsController],
  providers: [
    AddPlayerUseCase,
    { provide: TEAM_REPO_TOKEN, useClass: PrismaTeamRepository },
  ],
  exports: [TEAM_REPO_TOKEN],
})
export class TeamsModule {}
