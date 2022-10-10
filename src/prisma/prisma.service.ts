import { INestApplication, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from 'prisma/prisma-client';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor(config: ConfigService) {
        super({
            datasources: {
                db: {
                    url: config.get('DATABASE_URL'),
                },
            },
        });
    }

    async enableShutdownHooks(app: INestApplication) {
        this.$on('beforeExit', async () => {
            // do any database clean up here before the application exits

            await app.close();
        });
    }

    async cleanDb() {
        this.$transaction([
            this.bookmark.deleteMany(),
            this.token.deleteMany(),
            this.post.deleteMany(),
            this.category.deleteMany(),
            this.user.deleteMany(),
        ]);
    }
}
