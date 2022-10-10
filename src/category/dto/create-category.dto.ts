import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
    @ApiProperty({ description: 'name of the category', required: true })
    @IsNotEmpty()
    @IsString()
    name: string;
}
