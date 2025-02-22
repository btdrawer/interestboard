import * as O from "fp-ts/Option";
import * as B from "./Board";
import {
    FacadeError,
    FacadeErrorCode,
} from "../../common/contract/FacadeError";

const boardError = (
    code: FacadeErrorCode,
    id: O.Option<B.BoardId>,
    message: O.Option<string>,
): BoardError => ({
    code,
    resource: "board",
    id,
    message: O.getOrElse(() => "An error occurred.")(message),
});

export const boardBadRequestError = (
    id: B.BoardId,
    message: O.Option<string>,
): BoardError => boardError(FacadeErrorCode.BadRequest, O.some(id), message);

export const boardNotFoundError = (
    id: B.BoardId,
    message: O.Option<string>,
): BoardError => boardError(FacadeErrorCode.NotFound, O.some(id), message);

export const boardForbiddenError = (
    id: B.BoardId,
    message: O.Option<string>,
): BoardError => boardError(FacadeErrorCode.Forbidden, O.some(id), message);

export const boardInternalError = (
    id: O.Option<B.BoardId>,
    message: O.Option<string>,
): BoardError => boardError(FacadeErrorCode.InternalError, id, message);

export type BoardError = FacadeError<B.BoardId>;
