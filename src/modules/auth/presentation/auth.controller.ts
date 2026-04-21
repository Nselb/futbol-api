import { Body, Controller, Post } from '@nestjs/common';
import { Public } from 'src/shared/decorators/is-public.decorator';
import { LoginUseCase } from '../application/use-cases/LoginUseCase';
import { LoginDto } from '../application/dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('login')
  @Public()
  async login(@Body() dto: LoginDto) {
    return this.loginUseCase.execute(dto);
  }
}
