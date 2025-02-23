import * as t from "io-ts";
import * as td from "io-ts-types";
import { v4 as uuidv4 } from "uuid";
import { userContext, userId } from "../../user/types/User";
import { boardId } from "../../board/types/Board";

export const postId = td.UUID;
export const postCursor = t.string;

export enum VoteType {
    Upvote = "Upvote",
    Downvote = "Downvote",
}

export const voteType = t.union([
    t.literal(VoteType.Upvote),
    t.literal(VoteType.Downvote),
]);

export const post = t.type({
    id: postId,
    authorId: userId,
    boardId,
    title: t.string,
    body: t.string,
    upvotes: t.number,
    downvotes: t.number,
    userVote: td.optionFromNullable(voteType),
    comments: t.number,
    created: td.DateFromISOString,
    updated: td.DateFromISOString,
    deleted: td.optionFromNullable(td.DateFromISOString),
});

export type PostId = t.TypeOf<typeof postId>;
export type PostCursor = t.TypeOf<typeof postCursor>;
export type Post = t.TypeOf<typeof post>;

export const generatePostId = (): PostId => uuidv4() as PostId;
