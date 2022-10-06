import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
    constructor(private prisma: PrismaService) {}
    async createBookmark(userId: number, dto: CreateBookmarkDto) {
        const bookmark = await this.prisma.bookmark.create({
            data: {
                ...dto,
                userId,
            },
        });
        return bookmark;
    }

    getBookmarks(params: {
        take: number;
        cursor?: Prisma.BookmarkWhereUniqueInput;
        skip?: number;
        where?: Prisma.BookmarkWhereInput;
        order?: { field: string; by: 'asc' | 'desc' };
    }) {
        return this.prisma.bookmark.findMany({
            take: params.take,
            skip: params.skip,
            cursor: params.cursor,
            where: params.where,
            orderBy: {
                [params.order.field]: params.order.by,
            },
            include: { user: { select: { id: true, firstName: true, lastName: true } } },
        });
    }

    async getBookmarkById(userId: number, bookmarkId: number) {
        const bookmark = await this.prisma.bookmark.findFirst({
            where: {
                userId: userId,
                id: bookmarkId,
            },
        });
        if (!bookmark) {
            throw new NotFoundException('bookmark does not exist');
        }
        return bookmark;
    }

    async editBookmarkById(userId: number, bookmarkId: number, dto: EditBookmarkDto) {
        const bookmark = await this.prisma.bookmark.findUnique({
            where: {
                id: bookmarkId,
            },
        });

        if (!bookmark || bookmark.userId !== userId) {
            throw new ForbiddenException('Access to the resource denied');
        }

        return this.prisma.bookmark.update({
            where: {
                id: bookmarkId,
            },
            data: {
                ...dto,
            },
        });
    }

    async deleteBookmarkById(userId: number, bookmarkId: number) {
        const bookmark = await this.prisma.bookmark.findUnique({
            where: {
                id: bookmarkId,
            },
        });
        if (!bookmark || bookmark.userId !== userId) {
            throw new ForbiddenException('access defined to the resoucce');
        }
        await this.prisma.bookmark.delete({ where: { id: bookmarkId } });
    }
}
