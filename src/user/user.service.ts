import { Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { Prisma, User, UserRole } from 'prisma/prisma-client';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async createUser(
        dto: { email: string; password: string },
        trx?: Prisma.TransactionClient,
    ): Promise<User> {
        const prisma = trx || this.prisma;
        const hash = await argon.hash(dto.password);

        // save the new user in db
        const user = await prisma.user.create({
            data: {
                email: dto.email,
                hash,
            },
        });

        delete user.hash;
        return user;
    }

    findOne(findData: { id?: number; email?: string }): Promise<User | undefined> {
        return this.prisma.user.findUnique({
            where: findData,
        });
    }

    async setRole(email: string, role: UserRole): Promise<boolean> {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return false;
        }

        if (user) {
            await this.prisma.user.update({
                where: {
                    email,
                },
                data: {
                    role: role,
                },
            });
        }
        return true;
    }

    async editUser(userId: number, dto: EditUserDto): Promise<User> {
        const user = await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                ...dto,
            },
        });
        delete user.hash;
        return user;
    }
}
