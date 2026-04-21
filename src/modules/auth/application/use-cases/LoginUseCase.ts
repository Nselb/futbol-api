import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  type IUserRepository,
  USER_REPO_TOKEN,
} from 'src/modules/users/domain/repositories/IUserRepository';
import { LoginDto } from '../dtos/login.dto';
import { LoginResponseDto } from '../dtos/login-response.dto';
import { JwtPayloadDto } from '../dtos/jwt-payload.dto';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPO_TOKEN) private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.userRepository.findByUsername(dto.username);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const validPassowrd = await bcrypt.compare(dto.password, user.password);
    if (!validPassowrd) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const jwtPayload = new JwtPayloadDto(user.id, user.username, user.role);

    const token = this.jwtService.sign({ ...jwtPayload });

    return new LoginResponseDto(token);
  }
}
