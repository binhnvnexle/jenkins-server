import { Module } from '@nestjs/common';
import { CategoryModule } from '../category/category.module';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { CategoryExistsRule } from './validators/category-exists.validator';

@Module({
    controllers: [PostController],
    providers: [PostService, CategoryExistsRule],
    imports: [CategoryModule],
})
export class PostModule {}
