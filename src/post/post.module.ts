import { Module } from '@nestjs/common';
import { CategoryModule } from '../category/category.module';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { CategoryExistsValidator } from './validators/category-exists.validator';

@Module({
    controllers: [PostController],
    providers: [PostService, CategoryExistsValidator],
    imports: [CategoryModule],
})
export class PostModule {}
