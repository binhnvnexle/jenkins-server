import { User, UserRole } from '.prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UserEntity implements User {
    @ApiProperty()
    id: number;
    hash: string;
    @ApiProperty({ description: 'email of the user' })
    email: string;
    @ApiProperty({ description: 'first name of the user' })
    firstName: string;
    @ApiProperty({ description: 'last name of the user' })
    lastName: string;
    @ApiProperty({ description: 'created date of of the user' })
    createdAt: Date;
    @ApiProperty({ description: 'updated date of the user' })
    updatedAt: Date;
    @ApiProperty({ description: 'role of the user' })
    role: UserRole;
}
