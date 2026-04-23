import { Body, Controller, Post } from '@nestjs/common';
import { AddPlayerUseCase } from '../application/use-cases/AddPlayerUseCase';
import { AddPlayerDto } from '../application/dtos/add-player.dto';

@Controller('teams')
export class TeamsController {
  constructor(private readonly addPlayerUseCase: AddPlayerUseCase) {}

  @Post('addPlayer')
  async addPlayer(@Body() dto: AddPlayerDto) {
    return await this.addPlayerUseCase.execute(dto);
  }
}
