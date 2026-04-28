import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin_user' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'Admin@1234' })
  @IsString()
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
  password: string;
}
