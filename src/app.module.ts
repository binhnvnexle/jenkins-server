import { CacheModule, Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import * as redisStore from 'cache-manager-redis-store';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard, RolesGuard } from './auth/guards';
import { BookmarkModule } from './bookmark/bookmark.module';
import { CategoryModule } from './category/category.module';
import { Environment } from './common';
import { HttpCacheInterceptor } from './common/interceptors';
import { validate } from './common/validates';
import { PostModule } from './post/post.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';

const transports: (
    | winston.transports.FileTransportInstance
    | winston.transports.ConsoleTransportInstance
)[] = [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
];

if (process.env.NODE_ENV !== Environment.Production) {
    transports.push(new winston.transports.Console({}));
}

export const logger = WinstonModule.createLogger({
    level: process.env.LOG_LEVEL || 'verbose',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        nestWinstonModuleUtilities.format.nestLike('APP'),
    ),
    transports,
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
            ttl: Number(process.env.CACHE_TTL_IN_SECOND) || 5,
            max: Number(process.env.CACHE_MAX_ITEM) || 100,
        }),
        AuthModule,
        UserModule,
        BookmarkModule,
        PrismaModule,
        PostModule,
        CategoryModule,
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
