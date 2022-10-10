import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto';

export class PaginationPostQueryDto extends PaginationQueryDto {
    @ApiProperty({ description: 'User Id of posts to filter', required: false })
    @IsNumber()
    @IsOptional()
    userId: string;
}
