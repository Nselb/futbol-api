import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { Role } from 'src/modules/roles/domain/enums/Role';
import { CreateTeamUseCase } from '../application/use-cases/CreateTeamUseCase';
import { AddPlayerUseCase } from '../application/use-cases/AddPlayerUseCase';
import { CreateTeamDto } from '../application/dtos/create-team.dto';
import { AddPlayerDto } from '../application/dtos/add-player.dto';

@Controller('teams')
export class TeamsController {
  constructor(
    private readonly createTeam: CreateTeamUseCase,
    private readonly addPlayerUseCase: AddPlayerUseCase,
  ) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateTeamDto) {
    return this.createTeam.execute(dto);
  }

  @Post('addPlayer')
  @Roles(Role.ADMIN)
  async addPlayer(@Body() dto: AddPlayerDto) {
    return await this.addPlayerUseCase.execute(dto);
  }
}
