import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
    // @IsNumber()
    // @Validate(CategoryExistsRule)
    categoryId: number;
}
