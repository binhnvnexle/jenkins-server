import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignOutDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'Refresh token which was generated at login time',
    })
    readonly refreshToken: string;
}
