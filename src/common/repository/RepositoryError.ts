import * as t from "io-ts";
import * as td from "io-ts-types";
import * as O from "fp-ts/Option";

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
        ids: t.array(idType),
        message: t.string,
    });

export const entityNotFoundError = <ID>(id: ID, message?: string) => ({
    code: RepositoryErrorCode.EntityNotFound,
    ids: [id],
    message: message || "Entity not found.",
});

export type EntityNotFoundError<ID> = t.TypeOf<
    ReturnType<typeof entityNotFoundErrorDescriptor<ID>>
>;

export const isRepositoryNotFoundError = <ID>(
    error: unknown,
    idType: t.Type<ID>,
): error is EntityNotFoundError<ID> => {
    return entityNotFoundErrorDescriptor(idType).is(error);
};

/** InternalError */

export const repositoryInternalErrorDescriptor = <ID>(idType: t.Type<ID>) =>
    t.type({
        code: t.literal(RepositoryErrorCode.InternalError),
        ids: t.array(idType),
        message: t.string,
    });

export const repositoryInternalError = <ID>(ids: ID[], message: string) => ({
    code: RepositoryErrorCode.InternalError,
    ids,
    message,
});

export type RepositoryInternalError<ID> = t.TypeOf<
    ReturnType<typeof repositoryInternalErrorDescriptor<ID>>
>;

export const isRepositoryInternalError = <ID>(
    error: unknown,
    idType: t.Type<ID>,
): error is RepositoryInternalError<ID> => {
    return repositoryInternalErrorDescriptor(idType).is(error);
};

/** RepositoryError */

export const repositoryError = <ID>(idType: t.Type<ID>) =>
    t.union([
        entityNotFoundErrorDescriptor(idType),
        repositoryInternalErrorDescriptor(idType),
    ]);

export type RepositoryError<ID> = t.TypeOf<
    ReturnType<typeof repositoryError<ID>>
>;
