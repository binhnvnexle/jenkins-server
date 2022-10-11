import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto';

export class PaginationPostQueryDto extends PaginationQueryDto {
    @ApiProperty({ description: 'User Id of posts to filter', required: false })
    @IsString()
    @IsOptional()
    userId: string;
}
