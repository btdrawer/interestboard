import * as O from "fp-ts/Option";
import * as B from "./Board";
import { FacadeError, FacadeErrorCode } from "../../common/facade/FacadeError";

const boardError = (
    code: FacadeErrorCode,
    ids: B.BoardId[],
    message: string,
): BoardError => ({
    code,
    resource: "board",
    ids,
    message,
});

export const boardBadRequestError = (
    ids: B.BoardId[],
    message: string,
): BoardError => boardError(FacadeErrorCode.BadRequest, ids, message);

export const boardNotFoundError = (
    ids: B.BoardId[],
    message: O.Option<string>,
): BoardError =>
    boardError(
        FacadeErrorCode.NotFound,
        ids,
        O.getOrElse(() => "Board not found.")(message),
    );

export const boardForbiddenError = (
    ids: B.BoardId[],
    message: string,
): BoardError => boardError(FacadeErrorCode.Forbidden, ids, message);

export const boardInternalError = (
    ids: B.BoardId[],
    message: O.Option<string>,
): BoardError =>
    boardError(
        FacadeErrorCode.InternalError,
        ids,
        O.getOrElse(() => "An internal error occurred.")(message),
    );

export type BoardError = FacadeError<B.BoardId>;
