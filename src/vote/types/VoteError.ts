import * as O from "fp-ts/Option";
import * as V from "./Vote";
import { FacadeError, FacadeErrorCode } from "../../common/facade/FacadeError";

const voteError = (
    code: FacadeErrorCode,
    ids: V.VoteId[],
    message: string,
): VoteError => ({
    code,
    resource: "vote",
    ids,
    message,
});

export const voteBadRequestError = (
    ids: V.VoteId[],
    message: string,
): VoteError => voteError(FacadeErrorCode.BadRequest, ids, message);

export const voteNotFoundError = (
    ids: V.VoteId[],
    message: O.Option<string>,
): VoteError =>
    voteError(
        FacadeErrorCode.NotFound,
        ids,
        O.getOrElse(() => "Vote not found.")(message),
    );

export const votesNotFoundError = (
    ids: V.VoteId[],
    message: O.Option<string>,
): VoteError =>
    voteError(
        FacadeErrorCode.NotFound,
        ids,
        O.getOrElse(() => "Some votes in the list were not found.")(message),
    );

export const voteInternalError = (
    ids: V.VoteId[],
    message: O.Option<string>,
): VoteError =>
    voteError(
        FacadeErrorCode.InternalError,
        ids,
        O.getOrElse(() => "An internal error occurred.")(message),
    );

export type VoteError = FacadeError<V.VoteId>;
