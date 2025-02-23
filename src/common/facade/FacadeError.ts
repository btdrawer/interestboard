import * as t from "io-ts";

export const facadeErrorCodeDescriptor = t.union([
    t.literal("BadRequest"),
    t.literal("NotFound"),
    t.literal("Forbidden"),
    t.literal("InternalError"),
]);

export enum FacadeErrorCode {
    BadRequest = "BadRequest",
    NotFound = "NotFound",
    Forbidden = "Forbidden",
    InternalError = "InternalError",
}

export const facadeErrorDescriptor = <ID>(idType: t.Type<ID>) =>
    t.type({
        code: facadeErrorCodeDescriptor,
        resource: t.string,
        ids: t.array(idType),
        message: t.string,
    });

export type FacadeError<ID> = t.TypeOf<
    ReturnType<typeof facadeErrorDescriptor<ID>>
>;
