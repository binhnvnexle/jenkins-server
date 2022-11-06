import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Validate } from 'class-validator';
import { CategoryExistsValidator } from '../validators';

export class CreatePostDto {
    @ApiProperty({ description: 'title of the post', required: true })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({ description: 'title of the post', required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ description: 'category id of the post category', required: true })
    @IsNotEmpty()
    @IsNumber()
    @Validate(CategoryExistsValidator)
    categoryId: number;
}
