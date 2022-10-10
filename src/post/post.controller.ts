import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Patch,
    Post,
} from '@nestjs/common';
import {
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNoContentResponse,
    ApiOkResponse,
    ApiOperation,
} from '@nestjs/swagger';
import { Post as PostModel } from 'prisma/prisma-client';
import { GetUser } from '../auth/decorators';
import { SwaggerController } from '../common/decorators';
import { CreatePostDto } from './dto/create-post.dto';
import { EditPostDto } from './dto/edit-post.dto';
import { PostEntity } from './entities';
import { PostService } from './post.service';

@Controller('posts')
@SwaggerController('posts')
export class PostController {
    constructor(private postService: PostService) {}

    @ApiOperation({ summary: 'Adds a new post' })
    @ApiCreatedResponse({
        description: 'Add a new post successfully',
        type: PostEntity,
    })
    @Post()
    createPost(@GetUser('id') userId: number, @Body() dto: CreatePostDto): Promise<PostModel> {
        return this.postService.createPost(userId, dto);
    }

    @ApiOperation({ summary: 'Get all posts' })
    @ApiOkResponse({
        description: 'get list of post successfully',
        type: PostEntity,
        isArray: true,
    })
    @Get()
    getAllPosts(): Promise<PostModel[]> {
        return this.postService.getAllPosts();
    }

    @Get()
    searchPosts(): Promise<PostModel[]> {
        return this.postService.getAllPosts();
    }

    @ApiOperation({ summary: 'Get a post by id' })
    @ApiOkResponse({
        description: 'get post by id successfully',
        type: PostEntity,
    })
    @Get(':id')
    getPostById(@Param('id', ParseIntPipe) postId: number) {
        return this.postService.getPostById(postId);
    }

    @ApiOperation({ summary: 'Edit a post by id' })
    @ApiOkResponse({
        description: 'edit post by id successfully',
        type: PostEntity,
    })
    @ApiForbiddenResponse({
        description: 'Access denied',
    })
    @Patch(':id')
    editPostById(
        @GetUser('id') userId: number,
        @Param('id', ParseIntPipe) postId: number,
        @Body() dto: EditPostDto,
    ): Promise<PostModel> {
        return this.postService.editPostById(userId, postId, dto);
    }

    @ApiOperation({ summary: 'Delete a post by id' })
    @ApiNoContentResponse({
        description: 'delete post by id successfully',
    })
    @ApiForbiddenResponse({
        description: 'Access denied',
    })
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    deletePost(
        @GetUser('id') userId: number,
        @Param('id', ParseIntPipe) postId: number,
    ): Promise<void> {
        return this.postService.deletePost(userId, postId);
    }
}
