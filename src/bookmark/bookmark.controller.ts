import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Logger,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import {
    ApiCreatedResponse,
    ApiNoContentResponse,
    ApiOkResponse,
    ApiOperation,
} from '@nestjs/swagger';

import { Bookmark as BookmarkModel, UserRole } from '@prisma/client';
import { GetUser } from '../auth/decorators';
import { getPaginationParams } from '../common';
import { Auth } from '../common/decorators/auth.decorator';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto, EditBookmarkDto, PaginationBookmarkQueryDto } from './dto';
import { BookmarkEntity } from './entities';

@Auth(UserRole.USER, 'bookmarks')
@Controller('bookmarks')
export class BookmarkController {
    constructor(private bookmarkService: BookmarkService, private readonly logger: Logger) {}

    // swagger decorators
    @ApiOperation({ summary: 'Adds a new bookmark' })
    @ApiCreatedResponse({
        description: 'Create a bookmark successfully',
        type: BookmarkEntity,
    })
    // api decorators
    @Post()
    createBookmark(
        @GetUser('id') userId: number,
        @Body() dto: CreateBookmarkDto,
    ): Promise<BookmarkModel> {
        return this.bookmarkService.createBookmark(userId, dto);
    }

    // swagger decorators
    @ApiOperation({ summary: 'Get a list of bookmarks' })
    @ApiOkResponse({
        description: 'Get list of bookmarks successfully',
        type: BookmarkEntity,
        isArray: true,
    })
    // api decorators
    @Get()
    getBookmarks(
        @GetUser('id') userId: number,
        @Query() paginationQueryDto: PaginationBookmarkQueryDto,
    ): Promise<BookmarkModel[]> {
        const pagination = getPaginationParams(paginationQueryDto);
        const filterParams = {
            take: pagination.take,
            skip: pagination.skip,
            cursor: pagination.cursor ? { id: pagination.cursor } : undefined,
            order: pagination.sort[0],
            where: { userId: userId, title: paginationQueryDto.title || undefined },
        };
        pagination.search.map((item) => {
            if (item.field === 'title' && item.value) {
                filterParams.where[item.field] = item.value;
            }
        });
        return this.bookmarkService.getBookmarks(filterParams);
    }

    // swagger decorators
    @ApiOperation({ summary: 'Get a bookmark by Id' })
    @ApiOkResponse({
        description: 'Get bookmark by id successfully',
        type: BookmarkEntity,
    })
    // api decorators
    @Get(':id')
    getBoomarkById(
        @GetUser('id') userId: number,
        @Param('id', ParseIntPipe) bookmarkId: number,
    ): Promise<BookmarkModel> {
        return this.bookmarkService.getBookmarkById(userId, bookmarkId);
    }

    // swagger decorators
    @ApiOperation({ summary: 'Update an existing bookmark by Id' })
    @ApiOkResponse({
        description: 'Update a bookmark by id successfully',
        type: BookmarkEntity,
    })
    // api decorators
    @Patch(':id')
    editBookmarkById(
        @GetUser('id') userId: number,
        @Param('id', ParseIntPipe) bookmarkId: number,
        @Body() dto: EditBookmarkDto,
    ): Promise<BookmarkModel> {
        return this.bookmarkService.editBookmarkById(userId, bookmarkId, dto);
    }

    // swagger decorators
    @ApiOperation({ summary: 'Delete a bookmark by Id' })
    @ApiNoContentResponse({
        description: 'Delete a bookmark by id successfully',
    })
    // api decorators
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    deleteBookmarkById(
        @GetUser('id') userId: number,
        @Param('id', ParseIntPipe) bookmarkId: number,
    ): Promise<void> {
        return this.bookmarkService.deleteBookmarkById(userId, bookmarkId);
    }
}
