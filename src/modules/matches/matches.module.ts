import { Module } from '@nestjs/common';
import { MatchesController } from './presentation/matches.controller';
import { MATCH_REPO_TOKEN } from './domain/repositories/IMatchRepository';
import { PrismaMatchRepository } from './infrastructure/repositories/PrismaMatchRepository';
import { CreateMatchUseCase } from './application/use-cases/CrateMatchUseCase';
import { StartMatchUseCase } from './application/use-cases/StartMatchUseCase';
import { PauseMatchUseCase } from './application/use-cases/PauseMatchUseCase';
import { HalfTimeUseCase } from './application/use-cases/HalfTimeUseCase';
import { FinishMatchUseCase } from './application/use-cases/FinishMatchUseCase';
import { RegisterEventUseCase } from './application/use-cases/RegisterEventUseCase';
import { GetLiveMatchUseCase } from './application/use-cases/GetLiveMatchUseCase';
import { GetAllMatchesUseCase } from './application/use-cases/GetAllMatchesUseCase';
import { MatchesGateway } from './infrastructure/gateways/matches.gateway';
import { PlayersModule } from '../players/players.module';

@Module({
  imports: [PlayersModule],
  controllers: [MatchesController],
  providers: [
    { provide: MATCH_REPO_TOKEN, useClass: PrismaMatchRepository },
    CreateMatchUseCase,
    StartMatchUseCase,
    PauseMatchUseCase,
    HalfTimeUseCase,
    FinishMatchUseCase,
    RegisterEventUseCase,
    GetLiveMatchUseCase,
    GetAllMatchesUseCase,
    MatchesGateway,
  ],
})
export class MatchesModule {}
