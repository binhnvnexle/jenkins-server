import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

export enum PrismaError {
    RecordDoesNotExist = 'P2025',
    RecordAlreadyExists = 'P2002',
}

export function isRecordDoesNotExistError(error: Error) {
    return (
        error instanceof PrismaClientKnownRequestError &&
        error.code === PrismaError.RecordDoesNotExist
    );
}
export function isRecordExistsError(error: Error) {
    return (
        error instanceof PrismaClientKnownRequestError &&
        error.code === PrismaError.RecordAlreadyExists
    );
}
