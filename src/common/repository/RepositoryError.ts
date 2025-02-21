import * as t from "io-ts";

/** RepositoryErrorCode */

export enum RepositoryErrorCode {
    EntityNotFound = "EntityNotFound",
    InternalError = "InternalError",
}

export const repositoryErrorCode = t.union([
    t.literal(RepositoryErrorCode.EntityNotFound),
    t.literal(RepositoryErrorCode.InternalError),
]);

/** EntityNotFound */

export const entityNotFoundErrorDescriptor = <ID>(idType: t.Type<ID>) =>
    t.type({
        code: t.literal(RepositoryErrorCode.EntityNotFound),
        id: idType,
        message: t.string,
    });

export const entityNotFoundError = <ID>(id: ID, message?: string) => ({
    code: RepositoryErrorCode.EntityNotFound,
    id,
    message: message || `Entity with id ${id} not found`,
});

export type EntityNotFoundError<ID> = t.TypeOf<
    ReturnType<typeof entityNotFoundErrorDescriptor<ID>>
>;

/** InternalError */

export const repositoryInternalErrorDescriptor = t.type({
    type: t.literal(RepositoryErrorCode.InternalError),
    message: t.string,
});

export const repositoryInternalError = (message: string) => ({
    type: RepositoryErrorCode.InternalError,
    message,
});

export type RepositoryInternalError = t.TypeOf<
    typeof repositoryInternalErrorDescriptor
>;

/** RepositoryError */

export const repositoryError = <ID>(idType: t.Type<ID>) =>
    t.union([
        entityNotFoundErrorDescriptor(idType),
        repositoryInternalErrorDescriptor,
    ]);

export type RepositoryError<ID> = t.TypeOf<
    ReturnType<typeof repositoryError<ID>>
>;
