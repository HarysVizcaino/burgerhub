import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserInput, UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepository) {}

  findById(id: string) {
    return this.usersRepo.findById(id);
  }

  async create(input: CreateUserInput) {
    try {
      const created = await this.usersRepo.create(input);

      // Remove the password property if it exists and is optional
      if (Object.prototype.hasOwnProperty.call(created, 'password')) {
        delete (created as Partial<typeof created>).password;
      }

      return created;
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (err?.code === 11000) {
        throw new BadRequestException('Email already exists');
      }
      throw err;
    }
  }

  findByEmail(email: string) {
    return this.usersRepo.findByEmail(email);
  }

  findByEmailWithPassword(email: string) {
    return this.usersRepo.findByEmailWithPassword(email);
  }
}
