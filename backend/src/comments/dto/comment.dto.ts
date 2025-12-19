import { ApiProperty } from '@nestjs/swagger';

export class CommentUserDto {
  @ApiProperty({ example: '656f0b9d6b1d7f0c8a2d1234' })
  id: string;

  @ApiProperty({ example: 'Harys Vizcaino' })
  name: string;

  @ApiProperty({ example: 'harys@example.com' })
  email: string;
}

export class CommentDto {
  @ApiProperty({ example: '65aa0b9d6b1d7f0c8a2d1111' })
  id: string;

  @ApiProperty({ example: 'This burger is 🔥' })
  text: string;

  @ApiProperty({ example: '2025-12-19T12:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ type: CommentUserDto })
  user: CommentUserDto;
}
