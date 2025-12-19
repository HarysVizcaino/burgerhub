import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';
import { Comment } from './schemas/comment.schema';

export type CommentDocument = HydratedDocument<Comment>;

export type CreateCommentInput = {
  text: string;
  burgerId: string;
  userId: string;
};

export type FindCommentsByBurgerInput = {
  burgerId: string;
  page: number;
  limit: number;
};

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<Comment>,
  ) {}

  create(input: CreateCommentInput): Promise<CommentDocument> {
    return this.commentModel.create({
      text: input.text.trim(),
      burger: new Types.ObjectId(input.burgerId),
      user: new Types.ObjectId(input.userId),
    });
  }

  findByBurgerPaginated(input: FindCommentsByBurgerInput): Promise<CommentDocument[]> {
    const { burgerId, page, limit } = input;
    const skip = (page - 1) * limit;

    return this.commentModel.find({ burger: new Types.ObjectId(burgerId) })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email');
  }

  countByBurger(burgerId: string): Promise<number> {
    return this.commentModel.countDocuments({ burger: new Types.ObjectId(burgerId) });
  }
}
