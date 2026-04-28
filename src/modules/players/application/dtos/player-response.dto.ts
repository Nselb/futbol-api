import { ApiProperty } from '@nestjs/swagger';

export class PlayerResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  readonly id: string;

  @ApiProperty({ example: 'Lionel Messi' })
  readonly name: string;

  @ApiProperty({ example: 10 })
  readonly number: number;

  @ApiProperty({ example: 'IS_PLAYING' })
  readonly status: string;

  constructor(id: string, name: string, number: number, status: string) {
    this.id = id;
    this.name = name;
    this.number = number;
    this.status = status;
  }
}
