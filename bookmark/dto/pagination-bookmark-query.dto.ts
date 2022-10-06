import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto';

export class PaginationBookmarkQueryDto extends PaginationQueryDto {
    @ApiProperty({ description: 'title of the bookmark to filter', required: false })
    @IsString()
    @IsOptional()
    title: string;
}
