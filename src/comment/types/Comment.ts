import * as t from "io-ts";
import * as td from "io-ts-types";
import { v4 as uuidv4 } from "uuid";
import { userId } from "../../user/types/User";
import { boardId } from "../../board/types/Board";
import { postId } from "../../post/types/Post";

export const commentId = td.UUID;
export const commentCursor = t.string;

export const comment = t.type({
    id: commentId,
    authorId: userId,
    boardId,
    postId,
    parentId: td.optionFromNullable(commentId),
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
