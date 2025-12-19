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

        (created as any).password = undefined;
  
        return created;
      } catch (err: any) {
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
