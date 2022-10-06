import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class PaginationQueryDto {
    @ApiProperty({
        description: 'Id of the last item in the previous page',
        required: false,
        nullable: true,
    })
    @IsString()
    @IsOptional()
    startId?: string;

    @ApiProperty({ description: 'Number of items to take', required: false })
    @IsString()
    @IsOptional()
    limit?: string;

    @ApiProperty({ description: 'Number of items to skip', required: false })
    @IsString()
    @IsOptional()
    skip?: string;

    @ApiProperty({
        description:
            'sorted by this field name. +fieldName to show greatest item first, -fieldName to show smallest item first',
        required: false,
    })
    @IsOptional()
    @IsString()
    sort?: string;

    // @ApiProperty({ description: 'List of field and value to search', required: false })
    // @IsOptional()
    // @IsString()
    // search?: string;
}
