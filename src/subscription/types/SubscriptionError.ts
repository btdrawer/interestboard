import * as O from "fp-ts/Option";
import * as S from "./Subscription";
import { FacadeError, FacadeErrorCode } from "../../common/facade/FacadeError";

const subscriptionError = (
    code: FacadeErrorCode,
    ids: S.BoardSubscriptionId[],
    message: string,
): SubscriptionError => ({
    code,
    resource: "subscription",
    ids,
    message,
});

export const subscriptionBadRequestError = (
    ids: S.BoardSubscriptionId[],
    message: string,
): SubscriptionError =>
    subscriptionError(FacadeErrorCode.BadRequest, ids, message);

export const subscriptionNotFoundError = (
    ids: S.BoardSubscriptionId[],
    message: O.Option<string>,
): SubscriptionError =>
    subscriptionError(
        FacadeErrorCode.NotFound,
        ids,
        O.getOrElse(() => "Subscription not found.")(message),
    );

export const subscriptionsNotFoundError = (
    ids: S.BoardSubscriptionId[],
    message: O.Option<string>,
): SubscriptionError =>
    subscriptionError(
        FacadeErrorCode.NotFound,
        ids,
        O.getOrElse(() => "Some subscriptions in the list were not found.")(
            message,
        ),
    );

export const subscriptionInternalError = (
    ids: S.BoardSubscriptionId[],
    message: O.Option<string>,
): SubscriptionError =>
    subscriptionError(
        FacadeErrorCode.InternalError,
        ids,
        O.getOrElse(() => "An internal error occurred.")(message),
    );

export type SubscriptionError = FacadeError<S.BoardSubscriptionId>;
