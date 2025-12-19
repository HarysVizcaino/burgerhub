import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './schemas/user.schema';

export type CreateUserInput = {
  name: string;
  email: string;
  passwordHash: string;
  isAdmin?: boolean;
  isActive?: boolean;
};

@Injectable()
export class UsersRepository { 
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>,
      ) {}

      findById(id: string) {
        return this.userModel.findById(new Types.ObjectId(id));
      }
  

      findByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({ email: this.normalizeEmail(email) });
      }

      findByEmailWithPassword(email: string): Promise<User | null> {
        return this.userModel
          .findOne({ email: this.normalizeEmail(email) })
          .select('+password');
      }

      create(input: CreateUserInput): Promise<User> {
        return this.userModel.create({
          name: input.name.trim(),
          email: this.normalizeEmail(input.email),
          password: input.passwordHash,
          isAdmin: input.isAdmin ?? false,
          isActive: input.isActive ?? true,
        });
      }

      private normalizeEmail(email: string): string {
        return email.toLowerCase().trim();
      }

}