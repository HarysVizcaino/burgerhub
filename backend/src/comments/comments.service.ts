import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentsRepository, CreateCommentInput } from './comments.repository';
import { BurgersService } from 'src/burgers/burgers.service';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { CommentDto } from './dto/comment.dto';
import { CommentsMapper } from './comments.mapper';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsRepo: CommentsRepository,
    private readonly burgersService: BurgersService,
  ) {}

  async createForBurger(input: CreateCommentInput): Promise<CommentDto> {
    const exists = await this.burgersService.existsById(input.burgerId);
    if (!exists) throw new NotFoundException('Burger not found');

    const comment = await this.commentsRepo.create(input);
    await this.burgersService.cleanDetailCache(input.burgerId);
    const data = CommentsMapper.toDto(comment);
    return data;
  }

  async findByBurgerPaginated(
    burgerId: string,
    page = 1,
    limit = 10,
  ): Promise<PaginatedResponseDto<CommentDto>> {
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const safeLimit =
      Number.isFinite(limit) && limit > 0 ? Math.min(limit, 50) : 10;

    const [data, total] = await Promise.all([
      this.commentsRepo.findByBurgerPaginated({
        burgerId,
        page: safePage,
        limit: safeLimit,
      }),
      this.commentsRepo.countByBurger(burgerId),
    ]);

    return {
      data: data.map((comment) => CommentsMapper.toDto(comment)),
      total,
      page: safePage,
      limit: safeLimit,
    };
  }
}
