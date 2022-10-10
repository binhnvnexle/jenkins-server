import { applyDecorators } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiInternalServerErrorResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function SwaggerController(swaggerTagName: string, isPublic?: boolean) {
    if (isPublic) {
        return applyDecorators(
            ApiTags(swaggerTagName),
            ApiBadRequestResponse({ description: 'Bad request' }),
            ApiInternalServerErrorResponse({ description: 'Internal server error' }),
        );
    }
    return applyDecorators(
        ApiTags(swaggerTagName),
        ApiBearerAuth(),
        ApiUnauthorizedResponse({ description: 'Unauthorized access' }),
        ApiBadRequestResponse({ description: 'Bad request' }),
        ApiInternalServerErrorResponse({ description: 'Internal server error' }),
    );
}
