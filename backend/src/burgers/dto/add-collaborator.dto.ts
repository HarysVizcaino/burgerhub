import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddCollaboratorDto {
  @ApiProperty({ description: 'The id of the user to add as collaborator', example: '694564acecdbf2f728fa5844' })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
