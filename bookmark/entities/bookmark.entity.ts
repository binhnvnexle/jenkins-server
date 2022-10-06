import { ApiProperty } from '@nestjs/swagger';
import { Bookmark } from '@prisma/client';

export class BookmarkEntity implements Bookmark {
    @ApiProperty()
    id: number;
    @ApiProperty({ description: 'created date of the bookmark' })
    createdAt: Date;
    @ApiProperty({ description: 'updated date of the bookmark' })
    updatedAt: Date;
    @ApiProperty({ description: 'the tittle of the bookmark' })
    title: string;
    @ApiProperty({ description: 'the description of the bookmark' })
    description: string;
    @ApiProperty({ description: 'the link of the bookmark' })
    link: string;
    @ApiProperty({ description: 'the id of the user who added the bookmark' })
    userId: number;
}
