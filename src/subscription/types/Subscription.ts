import * as t from "io-ts";
import * as td from "io-ts-types";
import * as U from "../../user/types/User";
import * as B from "../../board/types/Board";
import { getCompositeId } from "../../common/types/getCompositeId";

export const boardSubscriptionId = td.UUID;
export const boardSubscriptionCursor = t.string;

export enum BoardSubscriptionType {
    Admin = "Admin",
    Moderator = "Moderator",
    Member = "Member",
}

export const boardSubscriptionType = t.union([
    t.literal(BoardSubscriptionType.Admin),
    t.literal(BoardSubscriptionType.Moderator),
    t.literal(BoardSubscriptionType.Member),
]);

export const boardSubscription = t.type({
    id: boardSubscriptionId,
    userId: U.userId,
    boardId: B.boardId,
    type: boardSubscriptionType,
    created: td.DateFromISOString,
});

export type BoardSubscriptionId = t.TypeOf<typeof boardSubscriptionId>;
export type BoardSubscriptionCursor = t.TypeOf<typeof boardSubscriptionCursor>;
export type BoardSubscription = t.TypeOf<typeof boardSubscription>;

export const getBoardSubscriptionId = (
    userId: U.UserId,
    boardId: B.BoardId,
): BoardSubscriptionId =>
    getCompositeId(userId, boardId) as BoardSubscriptionId;
