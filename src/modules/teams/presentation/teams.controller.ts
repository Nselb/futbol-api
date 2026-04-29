import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query
} from '@nestjs/common';
import { Role } from 'src/modules/roles/domain/enums/Role';
import { Public } from 'src/shared/decorators/is-public.decorator';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { AddPlayerDto } from '../application/dtos/add-player.dto';
import { CreateTeamDto } from '../application/dtos/create-team.dto';
import { RegisterLineupDto } from '../application/dtos/register-lineup.dto';
import { AddPlayerUseCase } from '../application/use-cases/AddPlayerUseCase';
import { CreateTeamUseCase } from '../application/use-cases/CreateTeamUseCase';
import { GetAllTeamsUseCase } from '../application/use-cases/GetAllTeamsUseCase';
import { GetTeamPlayersUseCase } from '../application/use-cases/GetTeamPlayersUseCase';
import { RegisterLineupUseCase } from '../application/use-cases/RegisterLineupUseCase';
import { SearchTeamByNameUseCase } from '../application/use-cases/SearchTeamByNameUseCase';
import { UpdateTeamUseCase } from '../application/use-cases/UpdateTeamUseCase';

@Controller('teams')
export class TeamsController {
  constructor(
    private readonly createTeamUseCase: CreateTeamUseCase,
    private readonly updateTeamUseCase: UpdateTeamUseCase,
    private readonly addPlayerUseCase: AddPlayerUseCase,
    private readonly getTeamPlayersUseCase: GetTeamPlayersUseCase,
    private readonly registerLineupUseCase: RegisterLineupUseCase,
    private readonly getAllTeamsUseCase: GetAllTeamsUseCase,
    private readonly searchTeamByNameUseCase: SearchTeamByNameUseCase,
  ) {}

  @Get()
  @Public()
  async getAll() {
    const result = await this.getAllTeamsUseCase.execute();
    return result;
  }

  @Get('search')
  @Public()
  searchByName(@Query('name') name: string) {
    const result = this.searchTeamByNameUseCase.execute(name);
    return result;
  }

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateTeamDto) {
    return this.createTeamUseCase.execute(dto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() dto: CreateTeamDto) {
    return this.updateTeamUseCase.execute(id, dto);
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
    return await this.registerLineupUseCase.execute(
      dto.matchId,
      id,
      dto.playerIds,
    );
  }
}
