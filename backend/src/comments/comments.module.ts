import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { Comment, CommentSchema } from './schemas/comment.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';
import { BurgersModule } from 'src/burgers/burgers.module';
import { CommentsRepository } from './comments.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    UsersModule,
    BurgersModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService, CommentsRepository],
})
export class CommentsModule {}
