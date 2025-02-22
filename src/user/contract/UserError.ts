import * as O from "fp-ts/Option";
import * as U from "./User";
import {
    FacadeError,
    FacadeErrorCode,
} from "../../common/contract/FacadeError";

const userError = (
    code: FacadeErrorCode,
    id: O.Option<U.UserId>,
    message: O.Option<string>,
): UserError => ({
    code,
    resource: "user",
    id,
    message: O.getOrElse(() => "An error occurred.")(message),
});

export const userNotFoundError = (
    id: U.UserId,
    message: O.Option<string>,
): UserError => userError(FacadeErrorCode.NotFound, O.some(id), message);

export const userInternalError = (
    id: O.Option<U.UserId>,
    message: O.Option<string>,
): UserError => userError(FacadeErrorCode.InternalError, id, message);

export type UserError = FacadeError<U.UserId>;
