import * as O from "fp-ts/Option";
import * as P from "./Post";
import { FacadeError, FacadeErrorCode } from "../../common/facade/FacadeError";

export const postError = (
    code: FacadeErrorCode,
    ids: P.PostId[],
    message: string,
): PostError => ({
    code,
    resource: "post",
    ids,
    message,
});

export const postBadRequestError = (
    ids: P.PostId[],
    message: string,
): PostError => postError(FacadeErrorCode.BadRequest, ids, message);

export const postNotFoundError = (
    ids: P.PostId[],
    message: O.Option<string>,
): PostError =>
    postError(
        FacadeErrorCode.NotFound,
        ids,
        O.getOrElse(() => "Post not found.")(message),
    );

export const postForbiddenError = (
    ids: P.PostId[],
    message: O.Option<string>,
): PostError =>
    postError(
        FacadeErrorCode.Forbidden,
        ids,
        O.getOrElse(() => "You cannot perform this operation on this post.")(
            message,
        ),
    );

export const postInternalError = (
    ids: P.PostId[],
    message: O.Option<string>,
): PostError =>
    postError(
        FacadeErrorCode.InternalError,
        ids,
        O.getOrElse(() => "An internal error occurred.")(message),
    );

export type PostError = FacadeError<P.PostId>;
