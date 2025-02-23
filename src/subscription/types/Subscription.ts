import * as t from "io-ts";
import * as td from "io-ts-types";
import * as U from "../../user/types/User";
import * as B from "../../board/types/Board";
import { createHash } from "crypto";

export const boardSubscriptionId = td.UUID;
export const boardSubscriptionCursor = t.string;

export const boardSubscription = t.type({
    id: boardSubscriptionId,
    userId: U.userId,
    boardId: B.boardId,
    created: td.DateFromISOString,
});

export type BoardSubscriptionId = t.TypeOf<typeof boardSubscriptionId>;
export type BoardSubscriptionCursor = t.TypeOf<typeof boardSubscriptionCursor>;
export type BoardSubscription = t.TypeOf<typeof boardSubscription>;

export const getBoardSubscriptionId = (
    userId: U.UserId,
    boardId: B.BoardId,
): BoardSubscriptionId => {
    const hash = createHash("sha256");
    hash.update(userId);
    hash.update(boardId);
    const uuid = hash.digest("hex").slice(0, 32);
    return [
        uuid.slice(0, 8),
        uuid.slice(8, 12),
        uuid.slice(12, 16),
        uuid.slice(16, 20),
        uuid.slice(20, 32),
    ].join("-") as BoardSubscriptionId;
};
