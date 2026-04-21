import { IsEnum, IsString, Matches, MinLength } from 'class-validator';
import { Role } from 'src/modules/roles/domain/enums/Role';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  @MinLength(3)
  username: string;

  @IsString()
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
  password: string;

  @IsEnum(Role)
  role: Role;
}
