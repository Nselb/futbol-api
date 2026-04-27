import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { Role } from 'src/modules/roles/domain/enums/Role';
import { Public } from 'src/shared/decorators/is-public.decorator';
import { CreateTeamUseCase } from '../application/use-cases/CreateTeamUseCase';
import { AddPlayerUseCase } from '../application/use-cases/AddPlayerUseCase';
import { GetTeamPlayersUseCase } from '../application/use-cases/GetTeamPlayersUseCase';
import { RegisterLineupUseCase } from '../application/use-cases/RegisterLineupUseCase';
import { CreateTeamDto } from '../application/dtos/create-team.dto';
import { AddPlayerDto } from '../application/dtos/add-player.dto';
import { RegisterLineupDto } from '../application/dtos/register-lineup.dto';

@Controller('teams')
export class TeamsController {
  constructor(
    private readonly createTeamUseCase: CreateTeamUseCase,
    private readonly addPlayerUseCase: AddPlayerUseCase,
    private readonly getTeamPlayersUseCase: GetTeamPlayersUseCase,
    private readonly registerLineupUseCase: RegisterLineupUseCase,
  ) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateTeamDto) {
    return this.createTeamUseCase.execute(dto);
  }

  @Post('addPlayer')
  @Roles(Role.ADMIN)
  async addPlayer(@Body() dto: AddPlayerDto) {
    return await this.addPlayerUseCase.execute(dto);
  }

  @Get(':id/players')
  @Public()
  async getPlayers(@Param('id') id: string) {
    return await this.getTeamPlayersUseCase.execute(id);
  }

  @Post(':id/lineup')
  @Roles(Role.ADMIN)
  async registerLineup(
    @Param('id') id: string,
    @Body() dto: RegisterLineupDto,
  ) {
    return await this.registerLineupUseCase.execute(id, dto.playerIds);
  }
}
