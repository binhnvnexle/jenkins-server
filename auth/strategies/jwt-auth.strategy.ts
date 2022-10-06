import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

type JwtPayload = {
    sub: number;
    email: string;
};

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(config: ConfigService, private authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get('JWT_ACCESS_TOKEN_SECRET'),
        });
    }
    async validate(payload: JwtPayload) {
        const user = await this.authService.verifyUser(payload.sub);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
