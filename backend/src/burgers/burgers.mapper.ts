import { UsersMapper } from 'src/users/users.mapper';
import { BurgerListItemDto } from './dto/burger-list-item.dto';
import { Burger } from './schemas/burger.schema';
import { User } from 'src/users/schemas/user.schema';
import { BurgerDetailDto } from './dto/burger-detail.dto';

export class BurgersMapper {
  static toListItem(burger: Burger): BurgerListItemDto {
    return {
      id: burger._id.toString(),
      name: burger.name,
      ingredients: burger.ingredients,
      image: burger.image,
      createdAt: burger.createdAt.toISOString(),
      creator: burger.creator ? UsersMapper.toResponse(burger.creator as unknown as User) : null,
      commentsCount: burger.commentsCount ?? 0,
      collaboratorsCount: burger.collaborators?.length ?? 0,
    };
  }

  static toDetail(burger: Burger): BurgerDetailDto {
    return {
      id: burger._id.toString(),
      name: burger.name,
      ingredients: burger.ingredients,
      image: burger.image,
      createdAt: burger.createdAt.toISOString(),
      updatedAt: burger.updatedAt.toISOString(),
      creator: burger.creator ? UsersMapper.toResponse(burger.creator as unknown as User) : null,
      commentsCount: burger.commentsCount ?? 0,
      collaboratorsCount: burger.collaboratorsCount ?? 0,
    };
  }
}
