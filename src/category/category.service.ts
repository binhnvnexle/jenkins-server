import { Category } from '.prisma/client';
import { ForbiddenException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { isRecordExistsError } from '../common/utils';
import { PrismaService } from '../prisma/prisma.service';
import { EditCategoryDto } from './dto';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
    constructor(private prisma: PrismaService) {}

    async createCategory(dto: CreateCategoryDto): Promise<Category> {
        try {
            const catetory = await this.prisma.category.create({
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
        return this.prisma.category.findUnique({
            where: findData,
        });
    }

    getAllCategories(): Promise<Category[]> {
        return this.prisma.category.findMany({
            where: {},
        });
    }

    async getCategoryById(categoryId: number) {
        const category = await this.prisma.category.findUnique({
            where: {
                id: categoryId,
            },
        });
        if (!category) {
            throw new NotFoundException('category no found');
        }
        return category;
    }

    async editCategoryById(categoryId: number, dto: EditCategoryDto): Promise<Category> {
        return this.prisma.category.update({
            where: {
                id: categoryId,
            },
            data: {
                ...dto,
            },
        });
    }

    async deleteCategory(categoryId: number): Promise<void> {
        const refCategory = await this.prisma.category.findFirst({
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
        await this.prisma.category.delete({
            where: {
                id: categoryId,
            },
        });
    }
}
