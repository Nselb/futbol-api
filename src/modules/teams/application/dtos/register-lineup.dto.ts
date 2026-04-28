import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID, ArrayMinSize, ArrayMaxSize } from 'class-validator';

export class RegisterLineupDto {
  @ApiProperty({
    example: [
      'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      'b2c3d4e5-f6a7-8901-bcde-f12345678901',
      'c3d4e5f6-a7b8-9012-cdef-123456789012',
      'd4e5f6a7-b8c9-0123-defa-234567890123',
      'e5f6a7b8-c9d0-1234-efab-345678901234',
      'f6a7b8c9-d0e1-2345-fabc-456789012345',
      'a7b8c9d0-e1f2-3456-abcd-567890123456',
    ],
    type: [String],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @ArrayMinSize(7)
  @ArrayMaxSize(7)
  playerIds: string[];
}
