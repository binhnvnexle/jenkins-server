import { plainToClass } from 'class-transformer';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsString, validateSync } from 'class-validator';
import { Environment, LogLevel } from '../enums';

class EnvironmentVariables {
    @IsNotEmpty()
    @IsEnum(Environment)
    NODE_ENV: Environment;

    @IsNotEmpty()
    @IsString()
    POSTGRES_HOST: string;

    @IsNotEmpty()
    @IsNumber()
    POSTGRES_PORT: number;

    @IsNotEmpty()
    @IsString()
    POSTGRES_DB: string;

    @IsNotEmpty()
    @IsString()
    POSTGRES_USER: string;

    @IsNotEmpty()
    @IsString()
    POSTGRES_PASSWORD: string;

    @IsNotEmpty()
    @IsString()
    DATABASE_URL: string;

    @IsNotEmpty()
    @IsString()
    JWT_ACCESS_TOKEN_SECRET: string;

    @IsNotEmpty()
    @IsNumber()
    JWT_ACCESS_TOKEN_EXP_IN_SECOND: number;

    @IsNotEmpty()
    @IsString()
    JWT_REFRESH_TOKEN_SECRET: string;

    @IsNotEmpty()
    @IsNumber()
    JWT_REFRESH_TOKEN_EXP_IN_SECOND: number;

    @IsBoolean()
    CORS_ENABLED: boolean;

    @IsString()
    SWAGGER_USER: string;

    @IsString()
    SWAGGER_PASSWORD: string;

    @IsBoolean()
    SWAGGER_ENABLED: boolean;

    @IsString()
    SWAGGER_PATH: string;

    @IsNotEmpty()
    @IsString()
    REDIS_HOST: string;

    @IsNumber()
    REDIS_PORT: number;

    @IsString()
    REDIS_PASSWORD: string;

    @IsNumber()
    CACHE_TTL_IN_SECOND: number;

    @IsNumber()
    CACHE_MAX_ITEM: number;

    @IsNotEmpty()
    @IsNumber()
    PORT: number;

    @IsString()
    @IsEnum(LogLevel)
    LOG_LEVEL: string;

    @IsNotEmpty()
    @IsString()
    SENTRY_DSN: string;
}

export function validate(config: Record<string, unknown>) {
    const validatedConfig = plainToClass(EnvironmentVariables, config, {
        enableImplicitConversion: true,
    });
    const errors = validateSync(validatedConfig, {
        skipMissingProperties: false,
    });

    if (errors.length > 0) {
        throw new Error(errors.toString());
    }
    return validatedConfig;
}
