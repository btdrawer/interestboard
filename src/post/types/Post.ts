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

/** Inputs */

export const createPostInput = t.type({
    context: userContext,
    boardId,
    title: t.string,
    body: t.string,
});

export type CreatePostInput = t.TypeOf<typeof createPostInput>;

export const getPostInput = t.type({
    id: postId,
});

export type GetPostInput = t.TypeOf<typeof getPostInput>;

export const voteInput = t.type({
    context: userContext,
    id: postId,
    type: td.optionFromNullable(voteType),
});

export type VoteInput = t.TypeOf<typeof voteInput>;

export const listPostsByBoardInput = t.type({
    boardId,
    first: t.number,
    cursor: td.optionFromNullable(postCursor),
});

export type ListPostsByBoardInput = t.TypeOf<typeof listPostsByBoardInput>;

export const listPostsByUserInput = t.type({
    userId,
    first: t.number,
    cursor: td.optionFromNullable(postCursor),
});

export type ListPostsByUserInput = t.TypeOf<typeof listPostsByUserInput>;

export const deletePostInput = t.type({
    context: userContext,
    id: postId,
});

export type DeletePostInput = t.TypeOf<typeof deletePostInput>;
