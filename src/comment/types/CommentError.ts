import * as O from "fp-ts/Option";
import * as C from "./Comment";
import { FacadeError, FacadeErrorCode } from "../../common/facade/FacadeError";

const commentError = (
    code: FacadeErrorCode,
    ids: C.CommentId[],
    message: string,
): CommentError => ({
    code,
    resource: "comment",
    ids,
    message,
});

export const commentBadRequestError = (
    ids: C.CommentId[],
    message: string,
): CommentError => commentError(FacadeErrorCode.BadRequest, ids, message);

export const commentNotFoundError = (
    ids: C.CommentId[],
    message: O.Option<string>,
): CommentError =>
    commentError(
        FacadeErrorCode.NotFound,
        ids,
        O.getOrElse(() => "Comment not found.")(message),
    );

export const commentForbiddenError = (
    ids: C.CommentId[],
    message: O.Option<string>,
): CommentError =>
    commentError(
        FacadeErrorCode.Forbidden,
        ids,
        O.getOrElse(() => "You are not permitted to perform this action.")(
            message,
        ),
    );

export const commentInternalError = (
    ids: C.CommentId[],
    message: O.Option<string>,
): CommentError =>
    commentError(
        FacadeErrorCode.InternalError,
        ids,
        O.getOrElse(() => "An internal error occurred.")(message),
    );

export type CommentError = FacadeError<C.CommentId>;
