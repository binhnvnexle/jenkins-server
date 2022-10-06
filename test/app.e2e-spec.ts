import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { AuthDto } from '../src/auth/dto';
import { CreateBookmarkDto } from '../src/bookmark/dto';
import { EditBookmarkDto } from '../src/bookmark/dto/edit-bookmark.dto';
import { PrismaService } from '../src/prisma/prisma.service';
import { EditUserDto } from '../src/user/dto';

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
                    .stores('userAt', 'accessToken')
                    .stores('userRt', 'refreshToken');
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

    describe('Bookmark', () => {
        const createBookmarkDto: CreateBookmarkDto = {
            link: 'google.com',
            title: 'Google Search',
            description: 'Google home page',
        };

        describe('Get empty bookmarks', () => {
            it('Should get empty bookmarks', () => {
                return pactum
                    .spec()
                    .get('/bookmarks')
                    .withHeaders({ Authorization: 'Bearer $S{userAt}' })
                    .expectStatus(200)
                    .expectBody([]);
            });
        });
        describe('Create bookmark', () => {
            it('should throw if title is empty', () => {
                return pactum
                    .spec()
                    .post('/bookmarks')
                    .withBody({
                        link: createBookmarkDto.link,
                        description: createBookmarkDto.description,
                    })
                    .withHeaders({
                        Authorization: 'Bearer $S{userAt}',
                    })
                    .expectStatus(400);
            });

            it('should throw if link is empty', () => {
                return pactum
                    .spec()
                    .post('/bookmarks')
                    .withBody({
                        title: createBookmarkDto.title,
                        description: createBookmarkDto.description,
                    })
                    .withHeaders({
                        Authorization: 'Bearer $S{userAt}',
                    })
                    .expectStatus(400);
            });

            it('Should create a bookmark', () => {
                return pactum
                    .spec()
                    .post('/bookmarks')
                    .withBody(createBookmarkDto)
                    .withHeaders({
                        Authorization: 'Bearer $S{userAt}',
                    })
                    .expectStatus(201)
                    .stores('bookmarkId', 'id');
            });
        });
        describe('Get bookmarks', () => {
            it('should get bookmarks', () => {
                return pactum
                    .spec()
                    .get('/bookmarks')
                    .withHeaders({ Authorization: 'Bearer $S{userAt}' })
                    .expectStatus(200)
                    .expectJsonLength(1);
            });
        });
        describe('Get bookmark by id', () => {
            it('should get bookmark by id', () => {
                return pactum
                    .spec()
                    .get('/bookmarks/{id}')
                    .withPathParams('id', '$S{bookmarkId}')
                    .withHeaders({ Authorization: 'Bearer $S{userAt}' })
                    .expectStatus(200)
                    .expectJsonMatch({
                        id: '$S{bookmarkId}',
                    });
            });
        });
        describe('Edit bookmark by id', () => {
            const editBookmarkDto: EditBookmarkDto = {
                ...createBookmarkDto,
                link: 'www.microsoft.com',
            };

            it('should throw if bookmark does not exist', () => {
                return pactum
                    .spec()
                    .patch('/bookmarks/{id}')
                    .withPathParams('id', 1234)
                    .withHeaders({ Authorization: 'Bearer $S{userAt}' })
                    .withBody(editBookmarkDto)
                    .expectStatus(403);
            });

            it('should edit bookmark by id', () => {
                return pactum
                    .spec()
                    .patch('/bookmarks/{id}')
                    .withPathParams('id', '$S{bookmarkId}')
                    .withHeaders({ Authorization: 'Bearer $S{userAt}' })
                    .withBody(editBookmarkDto)
                    .expectStatus(200)
                    .expectJsonMatch({
                        link: 'www.microsoft.com',
                    });
            });
        });
        describe('Delete bookmark by id', () => {
            it('should delete a bookmark', () => {
                return pactum
                    .spec()
                    .delete('/bookmarks/{id}')
                    .withPathParams('id', '$S{bookmarkId}')
                    .withHeaders({ Authorization: 'Bearer $S{userAt}' })
                    .expectStatus(204);
            });
            it('should not return bookmark by id after deletion', async () => {
                return pactum
                    .spec()
                    .get('/bookmarks')
                    .withHeaders({ Authorization: 'Bearer $S{userAt}' })
                    .expectStatus(200)
                    .expectBody([]);
            });
        });
    });
});
