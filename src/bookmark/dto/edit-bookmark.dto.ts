import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class EditBookmarkDto {
    @IsString()
    @IsOptional()
    @ApiProperty({ description: 'Title of the bookmark', required: false })
    readonly title?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: 'Description of the bookmark', required: false })
    readonly description?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: 'Link of the bookmark', required: false })
    readonly link?: string;
}
