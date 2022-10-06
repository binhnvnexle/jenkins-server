// import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

// @Injectable()
// export class LocalGuard implements CanActivate {
//     constructor(private authService: AuthService) {}

//     canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
//         try {
//             const req = context.switchToHttp().getRequest();
//             const { email, password } = req.body;
//             const user = this.authService.validateUser({ email, password });
//             if (!user) return false;
//             req.user = user;
//             return true;
//         } catch (e) {
//             return false;
//         }
//     }
// }

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
