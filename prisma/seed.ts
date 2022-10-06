import { PrismaClient, UserRole } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
    // create two dummy articles
    const user1 = await prisma.user.upsert({
        where: { email: 'trunghm@nexlesoft.com' },
        update: {},
        create: {
            email: 'trunghm@nexlesoft.com',
            hash: '$argon2id$v=19$m=4096,t=3,p=1$LImhV+ElbSkx6l/pVkrY8Q$RGMtOHZXd6L/5swXkFkk5nWTkkHSbgRwu1l0j7KWDvg',
            role: UserRole.USER,
        },
    });

    console.log({ user1 });
}

// execute the main function
main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        // close Prisma Client at the end
        await prisma.$disconnect();
    });
