import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: '656f0b9d6b1d7f0c8a2d1234' })
  id: string;

  @ApiProperty({ example: 'Harys Vizcaino' })
  name: string;

  @ApiProperty({ example: 'harysvizcaino@gmail.com' })
  email: string;

  @ApiProperty({ example: false })
  isAdmin: boolean;
}
