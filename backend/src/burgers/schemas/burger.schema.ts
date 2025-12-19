import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

@Schema({ timestamps: true })
export class Burger extends Document {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ type: [String], required: true })
  ingredients: string[];

  @Prop()
  image?: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  creator: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: User.name, default: [] })
  collaborators: Types.ObjectId[];

  @Prop({ default: 0 })
  commentsCount: number;

  @Prop({ default: 0 })
  collaboratorsCount: number;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const BurgerSchema = SchemaFactory.createForClass(Burger);