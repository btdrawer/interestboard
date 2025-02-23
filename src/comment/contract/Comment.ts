import * as t from "io-ts";
import * as td from "io-ts-types";
import { v4 as uuidv4 } from "uuid";
import { userContext, userId } from "../../user/types/User";
import { postId } from "../../post/types/Post";

export const commentId = td.UUID;
export const commentCursor = t.string;

export const comment = t.type({
    id: commentId,
    authorId: userId,
    postId,
    body: t.string,
    upvotes: t.number,
    downvotes: t.number,
    created: td.DateFromISOString,
    updated: td.DateFromISOString,
    deleted: td.optionFromNullable(td.DateFromISOString),
});

export type CommentId = t.TypeOf<typeof commentId>;
export type CommentCursor = t.TypeOf<typeof commentCursor>;
export type Comment = t.TypeOf<typeof comment>;

export const generateCommentId = (): CommentId => uuidv4() as CommentId;

/** Input */

export const createCommentInput = t.type({
    context: userContext,
    postId,
    body: t.string,
});

export type CreateCommentInput = t.TypeOf<typeof createCommentInput>;

export const listCommentsByPost = t.type({
    postId,
    first: t.number,
    cursor: td.optionFromNullable(commentCursor),
});

export type ListCommentsByPost = t.TypeOf<typeof listCommentsByPost>;

export const listCommentsByUser = t.type({
    userId,
    first: t.number,
    cursor: td.optionFromNullable(commentCursor),
});

export type ListCommentsByUser = t.TypeOf<typeof listCommentsByUser>;
