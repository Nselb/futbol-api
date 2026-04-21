import { IsString, Matches } from 'class-validator';

export class LoginDto {
  @IsString()
  username: string;

  @IsString()
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
  password: string;
}
