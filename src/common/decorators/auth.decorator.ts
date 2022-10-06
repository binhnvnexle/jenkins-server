import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UserRole } from '.prisma/client';
import { Roles } from '../../auth/decorators';

export function Auth(role: UserRole, swaggerTagName: string) {
    return applyDecorators(
        Roles(role),
        ApiTags(swaggerTagName),
        ApiBearerAuth(),
        ApiUnauthorizedResponse({ description: 'Unauthorized access' }),
    );
}
