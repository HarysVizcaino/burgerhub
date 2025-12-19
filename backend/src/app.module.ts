import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { BurgersModule } from './burgers/burgers.module';
import { CommentsModule } from './comments/comments.module';
import { AuthModule } from './auth/auth.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: await config.get<string>('MONGO_URI'),
      }),
      imports: [ConfigModule],
    }),
    ThrottlerModule.forRoot([{
      ttl: 60,
      limit: 60,
    }]),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        try {
          return {
            store: await redisStore({
              host: config.get('REDIS_HOST', 'redis'),
              port: config.get('REDIS_PORT', 6379),
            }),
            ttl: config.get('CACHE_TTL', 60),
          };
        } catch (e) {
          console.warn('Redis not available, falling back to in-memory cache');
          return { ttl: config.get('CACHE_TTL', 60) };
        }
      },
    }),
    UsersModule,
    BurgersModule,
    CommentsModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
