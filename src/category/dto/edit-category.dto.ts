import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class EditCategoryDto {
    @ApiProperty({ description: 'name of the category', required: false })
    @IsOptional()
    @IsString()
    name: string;
}
