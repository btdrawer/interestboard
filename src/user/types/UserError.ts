import * as O from "fp-ts/Option";
import * as U from "./User";
import { FacadeError, FacadeErrorCode } from "../../common/facade/FacadeError";

const userError = (
    code: FacadeErrorCode,
    ids: U.UserId[],
    message: string,
): UserError => ({
    code,
    resource: "user",
    ids,
    message,
});

export const userBadRequestError = (
    ids: U.UserId[],
    message: string,
): UserError => userError(FacadeErrorCode.BadRequest, ids, message);

export const userNotFoundError = (
    ids: U.UserId[],
    message: O.Option<string>,
): UserError =>
    userError(
        FacadeErrorCode.NotFound,
        ids,
        O.getOrElse(() => "User not found.")(message),
    );

export const usersNotFoundError = (
    ids: U.UserId[],
    message: O.Option<string>,
): UserError =>
    userError(
        FacadeErrorCode.NotFound,
        ids,
        O.getOrElse(() => "Some users in the list were not found.")(message),
    );

export const userInternalError = (
    ids: U.UserId[],
    message: O.Option<string>,
): UserError =>
    userError(
        FacadeErrorCode.InternalError,
        ids,
        O.getOrElse(() => "An internal error occurred.")(message),
    );

export type UserError = FacadeError<U.UserId>;
