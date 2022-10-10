import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Validate } from 'class-validator';
import { CategoryExistsRule } from '../validators';

export class EditPostDto {
    @ApiProperty({ description: 'title of the post', required: false })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiProperty({ description: 'title of the post', required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ description: 'Id of the post category', required: false })
    @IsOptional()
    @IsNumber()
    @Validate(CategoryExistsRule)
    categoryId?: number;
}
