import { Module } from '@nestjs/common';
import { BurgersController } from './burgers.controller';
import { BurgersService } from './burgers.service';
import { Burger, BurgerSchema } from './schemas/burger.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { BurgersRepository } from './burgers.repository';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Burger.name, schema: BurgerSchema }]),
    UsersModule,
  ],
  controllers: [BurgersController],
  providers: [BurgersService, BurgersRepository, UsersService],
  exports: [BurgersService],
})
export class BurgersModule {}
