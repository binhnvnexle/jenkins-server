import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ description: 'Email of the user' })
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'Password of the user' })
    readonly password: string;
}
