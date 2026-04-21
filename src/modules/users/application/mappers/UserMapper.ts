import { User } from '../../domain/entities/User';
import { UserResponseDto } from '../dtos/user-response.dto';

export class UserMapper {
  static toResponse(user: User): UserResponseDto {
    return new UserResponseDto(user.id, user.username, user.name);
  }
}
