import * as O from "fp-ts/Option";
import * as U from "./User";
import {
    FacadeError,
    FacadeErrorCode,
} from "../../common/contract/FacadeError";

const userError = (
    code: FacadeErrorCode,
    id: O.Option<U.UserId>,
    message: string,
): UserError => ({
    code,
    resource: "user",
    id,
    message,
});

export const userBadRequestError = (
    id: O.Option<U.UserId>,
    message: string,
): UserError => userError(FacadeErrorCode.BadRequest, id, message);

export const userNotFoundError = (
    id: U.UserId,
    message: O.Option<string>,
): UserError =>
    userError(
        FacadeErrorCode.NotFound,
        O.some(id),
        O.getOrElse(() => "User not found.")(message),
    );

export const usersNotFoundError = (message: string): UserError =>
    userError(FacadeErrorCode.NotFound, O.none, message);

export const userInternalError = (
    id: O.Option<U.UserId>,
    message: O.Option<string>,
): UserError =>
    userError(
        FacadeErrorCode.InternalError,
        id,
        O.getOrElse(() => "An internal error occurred.")(message),
    );

export type UserError = FacadeError<U.UserId>;
