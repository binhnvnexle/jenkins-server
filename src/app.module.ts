import { CacheModule, Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import * as redisStore from 'cache-manager-redis-store';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard, RolesGuard } from './auth/guards';
import { BookmarkModule } from './bookmark/bookmark.module';
import { HttpCacheInterceptor } from './common/interceptors';
import { validate } from './common/validates';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';

export const logger = WinstonModule.createLogger({
    level: process.env.LOG_LEVEL || 'verbose',
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.ms(),
                nestWinstonModuleUtilities.format.nestLike('APP'),
            ),
        }),
    ],
});

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, cache: true, expandVariables: true, validate }),
        CacheModule.register({
            store: redisStore,
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
            auth_pass: process.env.REDIS_PASSWORD,
            isGlobal: true,
            ttl: Number(process.env.CACHE_TTL) || 5,
            max: Number(process.env.CACHE_MAX_ITEM) || 100,
        }),
        AuthModule,
        UserModule,
        BookmarkModule,
        PrismaModule,
        PostModule,
    ],
    providers: [
        Logger,
        {
            provide: APP_INTERCEPTOR,
            useClass: HttpCacheInterceptor,
        },
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        },
    ],
})
export class AppModule {}
