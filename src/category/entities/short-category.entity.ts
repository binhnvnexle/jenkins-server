import { Category } from '.prisma/client';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class ShortCategoryEntity implements Category {
    @ApiProperty({ description: 'id of the category' })
    id: number;

    @ApiHideProperty()
    createdAt: Date;

    @ApiHideProperty()
    updatedAt: Date;

    @ApiProperty({ description: 'name of the category' })
    name: string;
}
