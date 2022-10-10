import { Category } from '.prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CategoryEntity implements Category {
    @ApiProperty({ description: 'id of the category' })
    id: number;

    @ApiProperty({ description: 'created date of the category' })
    createdAt: Date;

    @ApiProperty({ description: 'updated date of the category' })
    updatedAt: Date;

    @ApiProperty({ description: 'name of the category' })
    name: string;
}
