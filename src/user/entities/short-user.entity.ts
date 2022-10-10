import { ApiProperty } from '@nestjs/swagger';

export class ShortUserEntity {
    @ApiProperty({ description: 'id of the user' })
    id: number;

    @ApiProperty({ description: 'first name of the user', required: false })
    firstName: string;

    @ApiProperty({ description: 'last name of the user', required: false })
    lastName: string;
}
