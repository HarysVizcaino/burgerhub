import { ApiProperty } from '@nestjs/swagger';
import { BurgerCreatorDto } from './burger-creator.dto';


export class BurgerListItemDto {
  @ApiProperty({ example: '657a0b9d6b1d7f0c8a2d9999' })
  id: string;

  @ApiProperty({ example: 'BBQ Bacon Burger' })
  name: string;

  @ApiProperty({ example: ['Beef', 'Bacon', 'Cheddar'] })
  ingredients: string[];

  @ApiProperty({ required: false, example: 'https://example.com/bbq.jpg' })
  image?: string;

  @ApiProperty({ example: '2025-12-19T12:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ type: BurgerCreatorDto, nullable: true })
  creator: BurgerCreatorDto | null;

  @ApiProperty({ example: 5 })
  commentsCount: number;

  @ApiProperty({ example: 2 })
  collaboratorsCount: number;
}
