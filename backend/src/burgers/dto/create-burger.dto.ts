import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, ArrayMinSize, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateBurgerDto {
  @ApiProperty({ description: 'The name of the burger', example: 'Cheeseburger' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @ApiProperty({ description: 'The ingredients of the burger', example: ['Cheese', 'Beef', 'Lettuce'] })
  @IsArray()
  @ArrayMinSize(1)
  ingredients: string[];

  @ApiProperty({ description: 'The image of the burger', example: 'https://example.com/burger.jpg' })
  @IsOptional()
  @IsString()
  image?: string;
}