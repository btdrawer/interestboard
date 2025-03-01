import * as t from "io-ts";
import * as td from "io-ts-types";
import * as U from "../../user/types/User";
import * as T from "../../thread/types/Thread";
import { getCompositeId } from "../../common/types/getCompositeId";

export const voteId = td.UUID;

export enum VoteType {
    Up = "Up",
    Down = "Down",
}

export const voteType = t.union([
    t.literal(VoteType.Up),
    t.literal(VoteType.Down),
]);

export const vote = t.type({
    id: voteId,
    userId: U.userId,
    threadId: T.threadId,
    parentId: td.optionFromNullable(T.threadId),
    type: voteType,
    created: td.DateFromISOString,
    updated: td.DateFromISOString,
});

export type VoteId = t.TypeOf<typeof voteId>;
export type Vote = t.TypeOf<typeof vote>;

export const generateVoteRecordId = (userId: U.UserId, threadId: T.ThreadId) =>
    getCompositeId([userId, threadId]);
