import { UserRole } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UserEntity {
    @ApiProperty()
    email: string;
    @ApiProperty()
    firstName: string;
    @ApiProperty()
    lastName: string;
    @ApiProperty()
    createdAt: Date;
    @ApiProperty()
    updatedAt: Date;
    @ApiProperty()
    role: UserRole;
}
