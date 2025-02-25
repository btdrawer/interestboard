import * as t from "io-ts";
import * as td from "io-ts-types";
import * as S from "./Subscription";
import * as U from "../../user/types/User";
import * as B from "../../board/types/Board";

export const listSubscriptionsByBoardInput = t.type({
    id: B.boardId,
    first: t.number,
    cursor: td.optionFromNullable(t.string),
});

export type ListSubscriptionsByBoardInput = t.TypeOf<
    typeof listSubscriptionsByBoardInput
>;

export const listSubscriptionsByUserInput = t.type({
    id: U.userId,
    first: t.number,
    cursor: td.optionFromNullable(t.string),
});

export type ListSubscriptionsByUserInput = t.TypeOf<
    typeof listSubscriptionsByUserInput
>;

export const subscribeToBoardInput = t.type({
    context: U.userContext,
    id: B.boardId,
});

export type SubscribeToBoardInput = t.TypeOf<typeof subscribeToBoardInput>;

export const unsubscribeFromBoardInput = t.type({
    context: U.userContext,
    id: B.boardId,
});

export type UnsubscribeFromBoardInput = t.TypeOf<
    typeof unsubscribeFromBoardInput
>;
