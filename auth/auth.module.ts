import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthStrategy, JwtRefreshStrategy, LocalStrategy } from './strategies';

@Module({
    imports: [JwtModule.register({}), UserModule],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtAuthStrategy, JwtRefreshStrategy],
})
export class AuthModule {}
