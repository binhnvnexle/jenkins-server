import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBookmarkDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'Title of the bookmark', required: true })
    readonly title: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: 'Description of the bookmark', required: false })
    readonly description?: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'Link of the bookmark', required: true })
    readonly link: string;
}
