import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  readonly id: string;

  @ApiProperty({ example: 'juan_perez' })
  readonly username: string;

  @ApiProperty({ example: 'Juan Pérez' })
  readonly name: string;

  constructor(id: string, username: string, name: string) {
    this.id = id;
    this.username = username;
    this.name = name;
  }
}
