import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ description: 'The text of the comment', example: 'This is a comment' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  text: string;
}
