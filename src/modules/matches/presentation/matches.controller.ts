import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Role } from 'src/modules/roles/domain/enums/Role';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { CreateMatchDto } from '../application/dtos/create-match.dto';
import { RegisterEventDto } from '../application/dtos/register-event.dto';
import { CreateMatchUseCase } from '../application/use-cases/CrateMatchUseCase';
import { FinishMatchUseCase } from '../application/use-cases/FinishMatchUseCase';
import { GetLiveMatchUseCase } from '../application/use-cases/GetLiveMatchUseCase';
import { HalfTimeUseCase } from '../application/use-cases/HalfTimeUseCase';
import { PauseMatchUseCase } from '../application/use-cases/PauseMatchUseCase';
import { RegisterEventUseCase } from '../application/use-cases/RegisterEventUseCase';
import { StartMatchUseCase } from '../application/use-cases/StartMatchUseCase';

@Controller('matches')
export class MatchesController {
  constructor(
    private readonly createMatch: CreateMatchUseCase,
    private readonly startMatch: StartMatchUseCase,
    private readonly pauseMatch: PauseMatchUseCase,
    private readonly halfTime: HalfTimeUseCase,
    private readonly finishMatch: FinishMatchUseCase,
    private readonly registerEvent: RegisterEventUseCase,
    private readonly getLiveMatch: GetLiveMatchUseCase,
  ) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateMatchDto) {
    return this.createMatch.execute(dto);
  }

  @Post(':id/start')
  @Roles(Role.ARBITRO)
  start(@Param('id') id: string) {
    return this.startMatch.execute(id);
  }

  @Post(':id/pause')
  @Roles(Role.ARBITRO)
  pause(@Param('id') id: string) {
    return this.pauseMatch.execute(id);
  }

  @Post(':id/half-time')
  @Roles(Role.ARBITRO)
  halfTimeEnd(@Param('id') id: string) {
    return this.halfTime.execute(id);
  }

  @Post(':id/finish')
  @Roles(Role.ARBITRO)
  finish(@Param('id') id: string) {
    return this.finishMatch.execute(id);
  }

  @Post(':id/events')
  @Roles(Role.ARBITRO)
  addEvent(@Param('id') id: string, @Body() dto: RegisterEventDto) {
    return this.registerEvent.execute(id, dto);
  }

  @Get(':id/live')
  live(@Param('id') id: string) {
    return this.getLiveMatch.execute(id);
  }
}
