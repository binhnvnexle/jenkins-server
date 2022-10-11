import { Prisma } from 'prisma/prisma-client';

export interface PostFilterType {
    take: number;
    cursor?: Prisma.PostWhereUniqueInput;
    skip?: number;
    where?: Prisma.PostWhereInput;
    order?: { field: string; by: 'asc' | 'desc' };
}
