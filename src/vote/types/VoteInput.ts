import * as t from "io-ts";
import * as V from "./Vote";
import * as U from "../../user/types/User";
import * as P from "../../post/types/Post";

export const voteInput = t.type({
    context: U.userContext,
    record: V.voteRecord,
    type: V.voteType,
});

export type VoteInput = t.TypeOf<typeof voteInput>;

export const listUserVotesByPostInput = t.type({
    context: U.userContext,
    postId: P.postId,
});

export type ListUserVotesByPostInput = t.TypeOf<
    typeof listUserVotesByPostInput
>;

export const unvoteInput = t.type({
    context: U.userContext,
    record: V.voteRecord,
});

export type UnvoteInput = t.TypeOf<typeof unvoteInput>;
