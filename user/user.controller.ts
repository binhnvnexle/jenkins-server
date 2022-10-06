import { Body, Controller, Get, Patch } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User as UserModel } from '@prisma/client';
import { GetUser } from '../auth/decorators';
import { EditUserDto } from './dto';
import { UserEntity } from './entities';
import { UserService } from './user.service';

// swagger decorators
@ApiTags('users')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Access defined' })
// API decorators
@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    // swagger decorators
    @ApiOperation({ summary: 'Get detail of the current user' })
    @ApiOkResponse({
        description: 'Get the current user successfully',
        type: UserEntity,
    })
    // api decorators
    @Get('me')
    getMe(@GetUser() user: UserModel): UserModel {
        return user;
    }

    // swagger decorators
    @ApiOperation({ summary: 'Edit the current user' })
    @ApiOkResponse({ description: 'Edit the current user successfully', type: UserEntity })
    // api decorators
    @Patch()
    editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto): Promise<UserModel> {
        return this.userService.editUser(userId, dto);
    }
}
