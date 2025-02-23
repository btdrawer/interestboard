import * as t from "io-ts";
import * as td from "io-ts-types";
import * as C from "./Comment";
import { userContext, userId } from "../../user/types/User";
import { postId } from "../../post/types/Post";

export const createCommentInput = t.type({
    context: userContext,
    postId,
    parentId: td.optionFromNullable(C.commentId),
    body: t.string,
});

export type CreateCommentInput = t.TypeOf<typeof createCommentInput>;

export const listCommentsByPost = t.type({
    postId,
    first: t.number,
    cursor: td.optionFromNullable(C.commentCursor),
});

export type ListCommentsByPost = t.TypeOf<typeof listCommentsByPost>;

export const listCommentsByUser = t.type({
    userId,
    first: t.number,
    cursor: td.optionFromNullable(C.commentCursor),
});

export type ListCommentsByUser = t.TypeOf<typeof listCommentsByUser>;

export const deleteCommentInput = t.type({
    context: userContext,
    id: C.commentId,
});

export type DeleteCommentInput = t.TypeOf<typeof deleteCommentInput>;
