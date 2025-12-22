import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { ParseObjectIdPipe } from 'src/common/pipes/parse-object-id.pipe';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import * as authenticatedRequestType from 'src/common/types/authenticated-request.type';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CommentDto } from './dto/comment.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';

@Controller('burgers/:id/comments')
@ApiTags('Comments')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiOperation({ summary: 'Create a new comment for a burger' })
  @ApiBody({ type: CreateCommentDto })
  @ApiResponse({ status: 201, type: CommentDto })
  @Post()
  create(
    @Param('id', ParseObjectIdPipe) burgerId: string,
    @Body() dto: CreateCommentDto,
    @Req() req: authenticatedRequestType.AuthenticatedRequest,
  ): Promise<CommentDto> {
    return this.commentsService.createForBurger({
      burgerId,
      userId: req.user.userId,
      text: dto.text,
    });
  }

  @ApiOperation({ summary: 'Get all comments for a burger' })
  @ApiResponse({ status: 200, type: PaginatedResponseDto<CommentDto> })
  @Get()
  findAll(
    @Param('id', ParseObjectIdPipe) burgerId: string,
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<CommentDto>> {
    return this.commentsService.findByBurgerPaginated(
      burgerId,
      query.page,
      query.limit,
    );
  }
}
