import { User } from 'src/users/schemas/user.schema';
import { CommentDto } from './dto/comment.dto';
import { Comment } from './schemas/comment.schema';
import { UsersMapper } from 'src/users/users.mapper';

export class CommentsMapper {
  static toDto(comment: Comment): CommentDto {
    return {
      id: comment._id.toString(),
      text: comment.text,
      createdAt: comment.createdAt.toISOString(),
      user: UsersMapper.toResponse(comment.user as unknown as User),
    };
  }
}
