import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as Sentry from '@sentry/node';
import { useContainer } from 'class-validator';
import * as basicAuth from 'express-basic-auth';
import { AppModule, logger } from './app.module';
import { SentryInterceptor } from './common/interceptors';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger,
    });

    const config = app.get(ConfigService);

    // enable CORS
    if (config.get('CORS_ENABLED')) {
        app.enableCors({
            // origin: ['https://localhost:3000', 'https://www.website.com']
            // methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
            // credentials: true,
            // preflightContinue: false,
            // optionsSuccessStatus: 204,
        });
    }

    // Allow app to inject service to custom class validators
    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    // Error log to Sentry
    Sentry.init({
        dsn: config.get('SENTRY_DSN'),
    });
    app.useGlobalInterceptors(new SentryInterceptor());

    // Prisma hook for graceful shutdown
    const prismaService = app.get(PrismaService);
    await prismaService.enableShutdownHooks(app);

    // API payload validation
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    // Swagger API documentation
    if (config.get('SWAGGER_ENABLED')) {
        const swaggerDocPath = config.get('SWAGGER_PATH') || 'docs';
        app.use(
            [`/${swaggerDocPath}`, `/${swaggerDocPath}-json`],
            basicAuth({
                challenge: true,
                users: {
                    [config.get('SWAGGER_USER')]: config.get('SWAGGER_PASSWORD'),
                },
            }),
        );

        const swaggerConfig = new DocumentBuilder()
            .setTitle('Bookmark API')
            .setDescription('The bookmark API description')
            .setVersion('1.0.0')
            .addBearerAuth()
            .build();
        const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
        SwaggerModule.setup(swaggerDocPath, app, swaggerDocument);
    }

    // Run the application on a network port
    await app.listen(config.get('PORT'));
}
bootstrap();
