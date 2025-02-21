import * as t from "io-ts";
import * as td from "io-ts-types";

export enum UserErrorCode {
    UserNotFound = "UserNotFound",
    InternalError = "InternalError",
}

export const userErrorCode = t.union([
    t.literal(UserErrorCode.UserNotFound),
    t.literal(UserErrorCode.InternalError),
]);

export const userNotFoundError = t.type({
    type: t.literal(UserErrorCode.UserNotFound),
    userId: td.UUID,
    message: t.string,
});

export const userInternalError = t.type({
    type: t.literal(UserErrorCode.InternalError),
    message: t.string,
});

export const userError = t.union([userNotFoundError, userInternalError]);

export type UserNotFoundError = t.TypeOf<typeof userNotFoundError>;
export type UserInternalError = t.TypeOf<typeof userInternalError>;
export type UserError = t.TypeOf<typeof userError>;
