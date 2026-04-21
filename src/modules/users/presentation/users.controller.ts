import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserUseCase } from '../application/use-cases/CreateUserUseCase';
import { CreateUserDto } from '../application/dtos/create-user.dto';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { Role } from 'src/modules/roles/domain/enums/Role';

@Controller('users')
export class UsersController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  @Roles(Role.ADMIN)
  async createUser(@Body() dto: CreateUserDto) {
    return await this.createUserUseCase.execute(dto);
  }
}
