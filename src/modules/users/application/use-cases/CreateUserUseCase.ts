import { ConflictException, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User } from '../../domain/entities/User';
import {
  USER_REPO_TOKEN,
  type IUserRepository,
} from '../../domain/repositories/IUserRepository';
import { UserMapper } from '../../infrastructure/mappers/UserMapper';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserResponseDto } from '../dtos/user-response.dto';

@Injectable()
export class CreateUserUseCase {
  constructor(@Inject(USER_REPO_TOKEN) private repository: IUserRepository) {}

  async execute(dto: CreateUserDto): Promise<UserResponseDto> {
    const exists = await this.repository.findByUsername(dto.username);
    if (exists) {
      throw new ConflictException('Username is already in use');
    }
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = new User(
      crypto.randomUUID(),
      dto.username,
      hashedPassword,
      dto.name,
      dto.role,
    );

    await this.repository.save(user);
    return UserMapper.toResponse(user);
  }
}
