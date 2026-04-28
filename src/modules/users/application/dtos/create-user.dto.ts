import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, Matches, MinLength } from 'class-validator';
import { Role } from 'src/modules/roles/domain/enums/Role';

export class CreateUserDto {
  @ApiProperty({ example: 'Juan Pérez' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'juan_perez' })
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty({ example: 'Admin@1234' })
  @IsString()
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
  password: string;

  @ApiProperty({ enum: Role, example: Role.ADMIN })
  @IsEnum(Role)
  role: Role;
}
