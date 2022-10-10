import { Category } from '.prisma/client';
import { ForbiddenException, HttpException, Injectable } from '@nestjs/common';
import { isRecordExistsError } from '../common/utils';
import { PrismaService } from '../prisma/prisma.service';
import { EditCategoryDto } from './dto';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
    constructor(private prismaService: PrismaService) {}

    async createCategory(dto: CreateCategoryDto): Promise<Category> {
        try {
            const catetory = await this.prismaService.category.create({
                data: {
                    ...dto,
                },
            });
            return catetory;
        } catch (err) {
            if (isRecordExistsError(err)) {
                throw new ForbiddenException('category is not available');
            }

            throw err;
        }
    }

    findOne(findData: { id?: number; name?: string }): Promise<Category | undefined> {
        return this.prismaService.category.findUnique({
            where: findData,
        });
    }

    getAllCategories(): Promise<Category[]> {
        return this.prismaService.category.findMany({
            where: {},
        });
    }

    getCategoryById(categoryId: number) {
        return this.prismaService.category.findUnique({
            where: {
                id: categoryId,
            },
        });
    }

    async editCategoryById(categoryId: number, dto: EditCategoryDto): Promise<Category> {
        return this.prismaService.category.update({
            where: {
                id: categoryId,
            },
            data: {
                ...dto,
            },
        });
    }

    async deleteCategory(categoryId: number): Promise<void> {
        const refCategory = await this.prismaService.category.findFirst({
            where: {
                posts: { some: {} },
            },
        });
        if (refCategory) {
            throw new HttpException(
                'at least one post is still referening the category under deletion',
                409,
            );
        }
        await this.prismaService.category.delete({
            where: {
                id: categoryId,
            },
        });
    }
}
