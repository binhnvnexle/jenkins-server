import { Post } from '.prisma/client';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { CategoryService } from '../category/category.service';
import { PrismaService } from '../prisma/prisma.service';
import { EditPostDto } from './dto';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostService {
    constructor(private prismaService: PrismaService, private categoryService: CategoryService) {}

    createPost(userId: number, dto: CreatePostDto): Promise<Post> {
        // await this.validatePostCreation(dto);

        return this.prismaService.post.create({
            data: {
                ...dto,
                userId,
            },
        });
    }

    getAllPosts(): Promise<Post[]> {
        return this.prismaService.post.findMany({
            where: {},
        });
    }

    getPostById(postId: number) {
        return this.prismaService.post.findUnique({
            where: {
                id: postId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }

    async editPostById(userId: number, postId: number, dto: EditPostDto): Promise<Post> {
        const post = await this.prismaService.post.findUnique({
            where: {
                id: postId,
            },
        });

        if (!post || post.userId !== userId) {
            throw new ForbiddenException('access denied');
        }

        // await this.validatePostUpdate(dto);

        return this.prismaService.post.update({
            where: {
                id: postId,
            },
            data: {
                ...dto,
            },
        });
    }

    async deletePost(userId: number, postId: number): Promise<void> {
        const post = await this.prismaService.post.findUnique({
            where: {
                id: postId,
            },
        });

        if (!post || post.userId !== userId) {
            throw new ForbiddenException('access denied');
        }

        await this.prismaService.post.delete({
            where: {
                id: postId,
            },
        });
    }

    // private async validatePostCreation(dto: CreatePostDto) {
    //     const { categoryId } = dto;
    //     const category = await this.categoryService.findOne({ id: categoryId });
    //     if (!category) {
    //         throw new BadRequestException('category does not exit');
    //     }
    // }

    // private async validatePostUpdate(dto: EditPostDto) {
    //     const { categoryId } = dto;
    //     if (categoryId) {
    //         const category = await this.categoryService.findOne({ id: categoryId });
    //         if (!category) {
    //             throw new BadRequestException('category does not exit');
    //         }
    //     }
    // }
}
