import { Post } from '.prisma/client';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { ShortCategoryEntity } from '../../category/entities';
import { ShortUserEntity } from '../../user/entities';

export class PostEntity implements Post {
    @ApiProperty({ description: 'id of the post' })
    id: number;
    @ApiProperty({ description: 'created date of the post' })
    createdAt: Date;
    @ApiProperty({ description: 'updated date of the post' })
    updatedAt: Date;
    @ApiProperty({ description: 'title of the post' })
    title: string;
    @ApiProperty({ description: 'description of the post', required: false })
    description: string;
    userId: number;
    @ApiProperty({ description: 'ownerId of the post', type: ShortUserEntity })
    user: number;
    @ApiHideProperty()
    categoryId: number;
    @ApiProperty({ description: 'category of the post', type: ShortCategoryEntity })
    category: object;
}
