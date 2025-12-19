import { User } from './schemas/user.schema';
import { UserResponseDto } from './dto/user-response.dto';

export class UsersMapper {
  static toResponse(user: User): UserResponseDto {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      isAdmin: !!user.isAdmin,
    };
  }
}
