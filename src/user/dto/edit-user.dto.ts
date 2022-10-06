import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class EditUserDto {
    @IsEmail()
    @IsOptional()
    @ApiProperty({ description: 'Email of the user', required: false })
    email?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: 'First name of the user', required: false })
    firstName?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: 'Last name of the user', required: false })
    lastName?: string;
}
