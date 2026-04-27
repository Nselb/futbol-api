import { Module } from '@nestjs/common';
import { AddPlayerUseCase } from './application/use-cases/AddPlayerUseCase';
import { TEAM_REPO_TOKEN } from './domain/repository/ITeamRepository';
import { PrismaTeamRepository } from './infrastructure/repository/PrismaTeamRepository';
import { TeamsController } from './presentation/teams.controller';
import { PlayersModule } from '../players/players.module';
import { CreateTeamUseCase } from './application/use-cases/CreateTeamUseCase';
import { GetTeamPlayersUseCase } from './application/use-cases/GetTeamPlayersUseCase';
import { RegisterLineupUseCase } from './application/use-cases/RegisterLineupUseCase';

@Module({
  imports: [PlayersModule],
  controllers: [TeamsController],
  providers: [
    CreateTeamUseCase,
    AddPlayerUseCase,
    GetTeamPlayersUseCase,
    RegisterLineupUseCase,
    { provide: TEAM_REPO_TOKEN, useClass: PrismaTeamRepository },
  ],
  exports: [TEAM_REPO_TOKEN],
})
export class TeamsModule {}
