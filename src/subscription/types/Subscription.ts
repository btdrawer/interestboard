import * as t from "io-ts";
import * as td from "io-ts-types";
import * as U from "../../user/types/User";
import * as B from "../../board/types/Board";
import { getCompositeId } from "../../common/types/getCompositeId";

export const boardSubscriptionId = td.UUID;

export const boardSubscription = t.type({
    id: boardSubscriptionId,
    userId: U.userId,
    boardId: B.boardId,
    created: td.DateFromISOString,
});

export type BoardSubscriptionId = t.TypeOf<typeof boardSubscriptionId>;
export type BoardSubscription = t.TypeOf<typeof boardSubscription>;

export const getBoardSubscriptionId = (
    userId: U.UserId,
    boardId: B.BoardId,
): BoardSubscriptionId =>
    getCompositeId([userId, boardId]) as BoardSubscriptionId;
