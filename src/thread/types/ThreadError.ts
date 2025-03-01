import * as O from "fp-ts/Option";
import * as T from "./Thread";
import { FacadeError, FacadeErrorCode } from "../../common/facade/FacadeError";

const threadError = (
    code: FacadeErrorCode,
    ids: T.ThreadId[],
    message: string,
): ThreadError => ({
    code,
    resource: "thread",
    ids,
    message,
});

export const threadBadRequestError = (
    ids: T.ThreadId[],
    message: string,
): ThreadError => threadError(FacadeErrorCode.BadRequest, ids, message);

export const threadNotFoundError = (
    ids: T.ThreadId[],
    message: O.Option<string>,
): ThreadError =>
    threadError(
        FacadeErrorCode.NotFound,
        ids,
        O.getOrElse(() => "Thread not found.")(message),
    );

export const threadForbiddenError = (
    ids: T.ThreadId[],
    message: O.Option<string>,
): ThreadError =>
    threadError(
        FacadeErrorCode.Forbidden,
        ids,
        O.getOrElse(() => "You are not permitted to perform this action.")(
            message,
        ),
    );

export const threadInternalError = (
    ids: T.ThreadId[],
    message: O.Option<string>,
): ThreadError =>
    threadError(
        FacadeErrorCode.InternalError,
        ids,
        O.getOrElse(() => "An internal error occurred.")(message),
    );

export type ThreadError = FacadeError<T.ThreadId>;
