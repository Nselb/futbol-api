import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Role } from 'src/modules/roles/domain/enums/Role';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { CreatePlayerDto } from '../application/dtos/create-player.dto';
import { PlayerResponseDto } from '../application/dtos/player-response.dto';
import { CreatePlayerUseCase } from '../application/use-cases/CreatePlayerUseCase';
import { FindPlayerUseCase } from '../application/use-cases/FindPlayerUseCase';
import { Public } from 'src/shared/decorators/is-public.decorator';

@Controller('players')
export class PlayersController {
  constructor(
    private readonly createPlayerUseCase: CreatePlayerUseCase,
    private readonly findPlayerUseCase: FindPlayerUseCase,
  ) {}

  @Post()
  @Roles(Role.ADMIN)
  async createPlayer(@Body() dto: CreatePlayerDto): Promise<PlayerResponseDto> {
    return await this.createPlayerUseCase.execute(dto);
  }

  @Get('byId/:id')
  @Public()
  async findById(@Param('id') id: string) {
    return await this.findPlayerUseCase.execute(id);
  }
}
