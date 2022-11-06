import { User, User as UserModel } from '.prisma/client';
import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNoContentResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { GetUser, Public } from './decorators';
import { AuthDto, SignOutDto } from './dto';
import { RefreshEntity, SigninEntity, UserEntity } from './entities';
import { JwtRefreshGuard, LocalAuthGuard } from './guards';

// swagger decorators
@ApiTags('auth')
// API decorators
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    // swagger decorators
    @ApiOperation({ summary: 'Sign up a new email/password account' })
    @ApiCreatedResponse({
        description: 'Create a new user successfully',
        type: UserEntity,
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    // api decorators
    @Public()
    @Post('signup')
    signup(@Body() dto: AuthDto): Promise<UserModel> {
        return this.authService.signup(dto);
    }

    // swagger decorators
    @ApiOperation({ summary: 'Sign in with email/password' })
    @ApiOkResponse({
        description: 'Sign in the user successfully',
        type: SigninEntity,
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    // api decorators
    @HttpCode(HttpStatus.OK)
    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('signin')
    signin(
        @GetUser() user: UserModel,
        @Body() dto: AuthDto,
    ): Promise<{ user: User; accessToken: string; refreshToken: string }> {
        return this.authService.localSignin(user);
    }

    // swagger decorators
    @ApiOperation({ summary: 'Sign out the current user' })
    @ApiNoContentResponse({ description: 'Sign out the user successfully' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiUnauthorizedResponse({ description: 'Access defined' })
    @ApiBearerAuth()
    // api decorators
    @HttpCode(HttpStatus.NO_CONTENT)
    @Post('signout')
    signOut(@GetUser('id') userId: number, @Body() dto: SignOutDto): Promise<void> {
        return this.authService.signOut(userId, dto);
    }

    // swagger decorators
    @ApiOperation({ summary: 'Refresh to get a new access token' })
    @ApiOkResponse({ description: 'Refresh token successfully', type: RefreshEntity })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiUnauthorizedResponse({ description: 'Access defined' })
    @ApiBearerAuth()
    // api decorators
    @Public()
    @UseGuards(JwtRefreshGuard)
    @HttpCode(HttpStatus.OK)
    @Post('refresh')
    refreshToken(
        @GetUser('id') userId: number,
        @GetUser('refreshToken') refreshToken: string,
    ): Promise<{ accessToken: string }> {
        return this.authService.refreshToken(userId, refreshToken);
    }
}
