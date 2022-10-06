import { ApiProperty } from '@nestjs/swagger';

export class SigninEntity {
    @ApiProperty()
    accessToken: string;
    @ApiProperty()
    refreshToken: string;
}
