import {
    CACHE_MANAGER,
    ForbiddenException,
    Inject,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';
import * as argon from 'argon2';
import { Cache } from 'cache-manager';
import * as sha1 from 'sha1';
import { authCacheConstant } from '../common/constants';
import { isRecordExistsError } from '../common/utils';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { AuthDto, SignOutDto } from './dto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private userService: UserService,
        private jwt: JwtService,
        private config: ConfigService,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    ) {}
    async signup(dto: AuthDto) {
        try {
            return await this.prisma.$transaction(async (trx) => {
                const user = await this.userService.createUser(dto, trx);
                // return the saved user
                return user;
            });
        } catch (err) {
            if (isRecordExistsError(err)) {
                throw new ForbiddenException('Credential is not available');
            }

            throw err;
        }
    }

    async validateUser(dto: AuthDto, trx?: Prisma.TransactionClient): Promise<User> {
        // get the user by email
        const user = await this.userService.findOne({ email: dto.email });
        if (!user) {
            return null;
        }
        // compare the password
        const isMatches = await argon.verify(user.hash, dto.password);

        if (isMatches) {
            delete user.hash;
            return user;
        }
        return null;
    }

    async localSignin(
        user: User,
    ): Promise<{ user: User; accessToken: string; refreshToken: string }> {
        const accessToken = await this.getJwtToken(user.email, user.id);
        const refreshToken = await this.getJwtRefresh(user.email, user.id);
        return { user, accessToken, refreshToken };
    }

    async verifyUser(userId: number): Promise<any> {
        const cachedUser = (await this.cacheManager.get(
            `${authCacheConstant.AUTH_CACHE_KEY}/${userId}`,
        )) as User;
        if (cachedUser) {
            return cachedUser;
        }

        const user = await this.userService.findOne({ id: userId });
        if (user) {
            const { hash, ...result } = user;
            await this.cacheManager.set(`${authCacheConstant.AUTH_CACHE_KEY}/${user.id}`, result, {
                ttl: authCacheConstant.AUTH_CACHE_TTL,
            });

            return result;
        }
        return null;
    }

    async signOut(userId: number, signOutDto: SignOutDto) {
        const token_sha1 = sha1(signOutDto.refreshToken);
        const token = await this.prisma.token.findFirst({
            where: {
                refreshTokenSha1: token_sha1,
            },
        });

        if (!token || token.refreshTokenSha1 !== token_sha1) {
            throw new ForbiddenException('Either access token does not exist or access denied');
        }

        await this.prisma.token.delete({
            where: {
                id: token.id,
            },
        });
    }

    async refreshToken(userId: number, refreshToken: string): Promise<{ accessToken: string }> {
        try {
            const token = await this.prisma.token.findFirst({
                where: {
                    refreshTokenSha1: sha1(refreshToken),
                    userId,
                },
            });
            if (!token) {
                throw new ForbiddenException('refresh token expired or does not exist');
            }

            const jwtRefreshTokenSecret = this.config.get('JWT_REFRESH_TOKEN_SECRET');

            const payload = await this.jwt.verifyAsync(refreshToken, {
                secret: jwtRefreshTokenSecret,
            });

            const accessToken = await this.getJwtToken(payload.email, payload.sub);
            return { accessToken };
        } catch (err) {
            if (err instanceof ForbiddenException === false) {
                throw new InternalServerErrorException();
            }
            throw err;
        }
    }

    private createToken(userId: number, hashedToken: string, trx?: Prisma.TransactionClient) {
        const prisma = trx || this.prisma;
        return prisma.token.create({
            data: {
                userId,
                refreshTokenSha1: hashedToken,
            },
        });
    }

    private async getJwtToken(email: string, userId: number): Promise<string> {
        const payload = {
            sub: userId,
            email,
        };
        const jwtTokenSecret = this.config.get('JWT_ACCESS_TOKEN_SECRET');
        const jwtTokenExp = `${this.config.get('JWT_ACCESS_TOKEN_EXP_IN_SECOND')}s`;

        return this.jwt.signAsync(payload, {
            expiresIn: jwtTokenExp,
            secret: jwtTokenSecret,
        });
    }

    private async getJwtRefresh(
        email: string,
        userId: number,
        trx?: Prisma.TransactionClient,
    ): Promise<string> {
        const payload = {
            sub: userId,
            email,
        };
        const jwtRefreshTokenSecret = this.config.get('JWT_REFRESH_TOKEN_SECRET');
        const jwtRefreshTokenExp = `${this.config.get('JWT_REFRESH_TOKEN_EXP_IN_SECOND')}s`;

        const refreshToken = await this.jwt.signAsync(payload, {
            expiresIn: jwtRefreshTokenExp,
            secret: jwtRefreshTokenSecret,
        });
        const refreshTokenSha1 = sha1(refreshToken);

        await this.createToken(userId, refreshTokenSha1, trx);
        return refreshToken;
    }
}
