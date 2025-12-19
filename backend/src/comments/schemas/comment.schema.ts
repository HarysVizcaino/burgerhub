import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { Burger } from 'src/burgers/schemas/burger.schema';

@Schema({ timestamps: true })
export class Comment extends Document {
  @Prop({ required: true, trim: true })
  text: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Burger.name, required: true })
  burger: Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

CommentSchema.index({ burger: 1, createdAt: -1 });
CommentSchema.index({ user: 1, createdAt: -1 });
