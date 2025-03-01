import * as t from "io-ts";
import * as td from "io-ts-types";
import * as V from "./Vote";
import * as U from "../../user/types/User";
import * as T from "../../thread/types/Thread";

export const voteInput = t.type({
    context: U.userContext,
    threadId: T.threadId,
    parentId: td.optionFromNullable(T.threadId),
    type: V.voteType,
});

export type VoteInput = t.TypeOf<typeof voteInput>;

export const listUserVotesByThreadInput = t.type({
    context: U.userContext,
    threadId: T.threadId,
});

export type ListUserVotesByThreadInput = t.TypeOf<
    typeof listUserVotesByThreadInput
>;

export const unvoteInput = t.type({
    context: U.userContext,
    threadId: T.threadId,
});

export type UnvoteInput = t.TypeOf<typeof unvoteInput>;
