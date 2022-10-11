import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { UserRole } from 'prisma/prisma-client';
import { AppModule } from '../src/app.module';
import { AuthDto } from '../src/auth/dto';
import { CreateCategoryDto } from '../src/category/dto';
import { EditPostDto } from '../src/post/dto';
import { PrismaService } from '../src/prisma/prisma.service';
import { EditUserDto } from '../src/user/dto';
import { UserService } from '../src/user/user.service';

describe('App e2e', () => {
    let app: INestApplication;
    let prisma: PrismaService;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleRef.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
            }),
        );

        await app.init();
        await app.listen(3335);

        prisma = app.get(PrismaService);
        await prisma.cleanDb();

        pactum.request.setBaseUrl('http://localhost:3335');
    });

    afterAll(() => {
        app.close();
    });

    describe('Auth', () => {
        const dto: AuthDto = {
            email: 'trunghm@nexlesoft.com',
            password: '12345678',
        };

        const adminDto: AuthDto = {
            email: 'admin@nexlesoft.com',
            password: '12345678',
        };

        describe('Signup', () => {
            it('Should throw if email is empty', () => {
                return pactum
                    .spec()
                    .post('/auth/signup')
                    .withBody({ password: dto.password })
                    .expectStatus(400);
            });

            it('Should throw if password is empty', () => {
                return pactum
                    .spec()
                    .post('/auth/signup')
                    .withBody({ email: dto.email })
                    .expectStatus(400);
            });

            it('Should throw if no body provided', () => {
                return pactum.spec().post('/auth/signup').expectStatus(400);
            });

            it('Should signup', () => {
                return pactum.spec().post('/auth/signup').withBody(dto).expectStatus(201);
            });
        });

        describe('Admin Signup', () => {
            it('Should signup for admin', () => {
                return pactum
                    .spec()
                    .post('/auth/signup')
                    .withBody(adminDto)
                    .expectStatus(201)
                    .stores('adminUserId', 'id');
            });

            it('Should set role for admin', async () => {
                const userService = app.get(UserService);
                await userService.setRole(adminDto.email, UserRole.ADMIN);
            });
        });
        describe('Signin', () => {
            it('Should throw if email is empty', () => {
                return pactum
                    .spec()
                    .post('/auth/signin')
                    .withBody({ password: dto.password })
                    .expectStatus(401);
            });

            it('Should throw if password is empty', () => {
                return pactum
                    .spec()
                    .post('/auth/signin')
                    .withBody({ email: dto.email })
                    .expectStatus(401);
            });

            it('Should throw if no body provided', () => {
                return pactum.spec().post('/auth/signin').expectStatus(401);
            });

            it('Should signin', () => {
                return pactum
                    .spec()
                    .post('/auth/signin')
                    .withBody(dto)
                    .expectStatus(200)
                    .stores('userAt', 'accessToken')
                    .stores('userRt', 'refreshToken');
            });
            it('Should signin', () => {
                return pactum
                    .spec()
                    .post('/auth/signin')
                    .withBody(dto)
                    .expectStatus(200)
                    .stores('userId', 'user.id')
                    .stores('userAt', 'accessToken')
                    .stores('userRt', 'refreshToken');
            });
        });

        describe('Admin signin', () => {
            it('Should signin for admin', () => {
                return pactum
                    .spec()
                    .post('/auth/signin')
                    .withBody(adminDto)
                    .expectStatus(200)
                    .stores('adminAt', 'accessToken')
                    .stores('adminRt', 'refreshToken');
            });
        });
        describe('Refresh token', () => {
            it('Should get a new token from refresh token', () => {
                return pactum
                    .spec()
                    .post('/auth/refresh')
                    .withHeaders({
                        Authorization: 'Bearer $S{userRt}',
                    })
                    .expectStatus(200);
            });
        });
        describe('Signout', () => {
            it('Should signout', () => {
                return pactum
                    .spec()
                    .post('/auth/signout')
                    .withHeaders({
                        Authorization: 'Bearer $S{userAt}',
                    })
                    .withBody({ refreshToken: '$S{userRt}' })
                    .expectStatus(204);
            });
            it('Should not refresh token after signout', () => {
                return pactum
                    .spec()
                    .post('/auth/refresh')
                    .withBody({ refreshToken: '$S{userRt}' })
                    .expectStatus(401);
            });
        });
    });

    describe('User', () => {
        describe('Get me', () => {
            it('Should get current user', () => {
                return pactum
                    .spec()
                    .get('/users/me')
                    .withHeaders({
                        Authorization: 'Bearer $S{userAt}',
                    })
                    .expectStatus(200);
            });
        });
        describe('Edit user', () => {
            const editUserDto: EditUserDto = {
                firstName: 'Trung',
                lastName: 'Huynh',
                email: 'trunghm1@nexlesoft.com',
            };

            it('Should edit the current user', () => {
                return pactum
                    .spec()
                    .patch('/users')
                    .withHeaders({
                        Authorization: 'Bearer $S{userAt}',
                    })
                    .withBody(editUserDto)
                    .expectStatus(200)
                    .expectJsonMatch({
                        firstName: editUserDto.firstName,
                        lastName: editUserDto.lastName,
                        email: editUserDto.email,
                    });
            });
        });
    });

    describe('Catetory', () => {
        const createCategoryDto: CreateCategoryDto = {
            name: 'test category',
        };
        describe('Get empty categories', () => {
            it('should return empty list', () => {
                return pactum
                    .spec()
                    .get('/categories')
                    .withHeaders({ Authorization: 'Bearer $S{adminAt}' })
                    .expectStatus(200)
                    .expectBody([]);
            });
        });

        describe('Add new category', () => {
            it('should throw when name is empty', () => {
                return pactum
                    .spec()
                    .post('/categories')
                    .withHeaders({ Authorization: 'Bearer $S{adminAt}' })
                    .withBody({})
                    .expectStatus(400);
            });

            it('should add a new category', () => {
                return pactum
                    .spec()
                    .post('/categories')
                    .withHeaders({ Authorization: 'Bearer $S{adminAt}' })
                    .withBody(createCategoryDto)
                    .expectStatus(201)
                    .stores('categoryId', 'id')
                    .expectJsonMatch({
                        ...createCategoryDto,
                    });
            });
        });

        describe('Get categories', () => {
            it('should get categories', () => {
                return pactum
                    .spec()
                    .get('/categories')
                    .withHeaders({ Authorization: 'Bearer $S{adminAt}' })
                    .expectStatus(200)
                    .expectJsonLength(1);
            });
        });
    });

    describe('Posts', () => {
        const createPostDto = {
            title: 'test title',
            description: 'test desc',
        };
        const createPostDto1 = {
            title: 'test title 1',
            description: 'test desc 1',
        };

        describe('Get empty posts', () => {
            it('should return empty list', () => {
                return pactum
                    .spec()
                    .get('/posts')
                    .withHeaders({ Authorization: 'Bearer $S{userAt}' })
                    .expectStatus(200)
                    .expectBody({ items: [], totalCount: 0 });
            });
        });

        describe('Add new post', () => {
            it('should throw if category is empty', () => {
                return pactum
                    .spec()
                    .post('/posts')
                    .withHeaders({ Authorization: 'Bearer $S{userAt}' })
                    .withBody({
                        title: createPostDto.title,
                        description: createPostDto.description,
                    })
                    .expectStatus(400);
            });

            it('should throw if category does not exist', () => {
                return pactum
                    .spec()
                    .post('/posts')
                    .withHeaders({ Authorization: 'Bearer $S{userAt}' })
                    .withBody({ title: createPostDto.title, category: 12 })
                    .expectStatus(400);
            });

            it('should throw if title is empty', () => {
                return pactum
                    .spec()
                    .post('/posts')
                    .withHeaders({ Authorization: 'Bearer $S{userAt}' })
                    .withBody({
                        description: createPostDto.description,
                        category: '$S{categoryId}',
                    })
                    .expectStatus(400);
            });

            it('should add new post', () => {
                return pactum
                    .spec()
                    .post('/posts')
                    .withHeaders({ Authorization: 'Bearer $S{userAt}' })
                    .withBody({
                        ...createPostDto,
                        categoryId: '$S{categoryId}',
                    })
                    .expectStatus(201)
                    .stores('postId', 'id')
                    .expectJsonMatch({
                        ...createPostDto,
                    });
            });

            it('should add a second post', () => {
                return pactum
                    .spec()
                    .post('/posts')
                    .withHeaders({ Authorization: 'Bearer $S{userAt}' })
                    .withBody({
                        ...createPostDto1,
                        categoryId: '$S{categoryId}',
                    })
                    .expectStatus(201)
                    .stores('postId1', 'id')
                    .expectJsonMatch({
                        ...createPostDto1,
                    });
            });
        });

        describe('Filter posts', () => {
            it('should get post by userId if userId does not exist', () => {
                return pactum
                    .spec()
                    .get('/posts?userId=12&limit=1&skip=0')
                    .withHeaders({ Authorization: 'Bearer $S{userAt}' })
                    .expectStatus(200)
                    .expectJsonMatch({ items: [], totalCount: 0 });
            });

            it('should get post by userId', () => {
                return pactum
                    .spec()
                    .get('/posts?userId=$S{userId}&limit=1&skip=0')
                    .withHeaders({ Authorization: 'Bearer $S{userAt}' })
                    .expectStatus(200)
                    .expectJsonMatch({ items: [{ id: '$S{postId}' }], totalCount: 2 });
            });
            it('should get the first page', () => {
                return pactum
                    .spec()
                    .get('/posts?limit=1&skip=0')
                    .withHeaders({ Authorization: 'Bearer $S{userAt}' })
                    .expectStatus(200)
                    .expectJsonMatch({ items: [{ id: '$S{postId}' }], totalCount: 2 });
            });
            it('should get the second page', () => {
                return pactum
                    .spec()
                    .get('/posts?limit=1&skip=1')
                    .withHeaders({ Authorization: 'Bearer $S{userAt}' })
                    .expectStatus(200)
                    .expectJsonMatch({ items: [{ id: '$S{postId1}' }], totalCount: 2 });
            });
            it('should order the items by asc order', () => {
                return pactum
                    .spec()
                    .get('/posts?limit=1&skip=0&sort=-id')
                    .withHeaders({ Authorization: 'Bearer $S{userAt}' })
                    .expectStatus(200)
                    .expectJsonMatch({ items: [{ id: '$S{postId}' }], totalCount: 2 });
            });
            it('should order the items by desc order', () => {
                return pactum
                    .spec()
                    .get('/posts?limit=1&skip=0&sort=+id')
                    .withHeaders({ Authorization: 'Bearer $S{userAt}' })
                    .expectStatus(200)
                    .expectJsonMatch({ items: [{ id: '$S{postId1}' }], totalCount: 2 });
            });
        });

        describe('Edit post', () => {
            const editPostDto: EditPostDto = {
                ...createPostDto,
                title: 'new title',
            };

            it('should throw if post does not exist', () => {
                return pactum
                    .spec()
                    .patch('/posts/{id}')
                    .withPathParams('id', 1234)
                    .withHeaders({ Authorization: 'Bearer $S{userAt}' })
                    .withBody(editPostDto)
                    .expectStatus(403);
            });

            it('should throw if category does not exist', () => {
                return pactum
                    .spec()
                    .patch('/posts/{id}')
                    .withPathParams('id', 1234)
                    .withHeaders({ Authorization: 'Bearer $S{userAt}' })
                    .withBody({ ...editPostDto, categoryId: 11 })
                    .expectStatus(400);
            });

            it('should edit post by id', () => {
                return pactum
                    .spec()
                    .patch('/posts/{id}')
                    .withPathParams('id', '$S{postId}')
                    .withHeaders({ Authorization: 'Bearer $S{userAt}' })
                    .withBody(editPostDto)
                    .expectStatus(200)
                    .expectJsonMatch({
                        title: 'new title',
                    });
            });
        });

        describe('Delete post by id', () => {
            it('should throw if post does not exist', () => {
                return pactum
                    .spec()
                    .delete('/posts/{id}')
                    .withPathParams('id', 123)
                    .withHeaders({ Authorization: 'Bearer $S{userAt}' })
                    .expectStatus(403);
            });

            it('should delete the first post', () => {
                return pactum
                    .spec()
                    .delete('/posts/{id}')
                    .withPathParams('id', '$S{postId}')
                    .withHeaders({ Authorization: 'Bearer $S{userAt}' })
                    .expectStatus(204);
            });

            it('should delete the second post', () => {
                return pactum
                    .spec()
                    .delete('/posts/{id}')
                    .withPathParams('id', '$S{postId1}')
                    .withHeaders({ Authorization: 'Bearer $S{userAt}' })
                    .expectStatus(204);
            });

            it('should not return post by id after deletion', async () => {
                return pactum
                    .spec()
                    .get('/posts')
                    .withHeaders({ Authorization: 'Bearer $S{userAt}' })
                    .expectStatus(200)
                    .expectBody({ items: [], totalCount: 0 });
            });
        });
    });
});
