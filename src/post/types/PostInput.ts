import * as t from "io-ts";
import * as td from "io-ts-types";
import * as P from "./Post";
import { userContext, userId } from "../../user/types/User";
import { boardId } from "../../board/types/Board";

export const createPostInput = t.type({
    context: userContext,
    boardId,
    title: t.string,
    body: t.string,
});

export type CreatePostInput = t.TypeOf<typeof createPostInput>;

export const getPostInput = t.type({
    id: P.postId,
});

export type GetPostInput = t.TypeOf<typeof getPostInput>;

export const voteInput = t.type({
    context: userContext,
    id: P.postId,
    type: td.optionFromNullable(P.voteType),
});

export type VoteInput = t.TypeOf<typeof voteInput>;

export const listPostsByBoardInput = t.type({
    boardId,
    first: t.number,
    cursor: td.optionFromNullable(P.postCursor),
});

export type ListPostsByBoardInput = t.TypeOf<typeof listPostsByBoardInput>;

export const listPostsByUserInput = t.type({
    userId,
    first: t.number,
    cursor: td.optionFromNullable(P.postCursor),
});

export type ListPostsByUserInput = t.TypeOf<typeof listPostsByUserInput>;

export const deletePostInput = t.type({
    context: userContext,
    id: P.postId,
});

export type DeletePostInput = t.TypeOf<typeof deletePostInput>;
