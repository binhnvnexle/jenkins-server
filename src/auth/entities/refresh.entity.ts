import { ApiProperty } from '@nestjs/swagger';

export class RefreshEntity {
    @ApiProperty()
    accessToken: string;
}
