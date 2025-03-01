import * as t from "io-ts";
import * as td from "io-ts-types";
import * as T from "./Thread";
import { userContext, userId } from "../../user/types/User";
import * as B from "../../board/types/Board";

export const createThreadInput = t.type({
    context: userContext,
    boardId: B.boardId,
    parentId: td.optionFromNullable(T.threadId),
    body: t.string,
});

export type CreateThreadInput = t.TypeOf<typeof createThreadInput>;

export const listThreadsByParent = t.type({
    parentId: td.optionFromNullable(T.threadId),
    first: t.number,
    cursor: td.optionFromNullable(T.threadCursor),
});

export type ListThreadsByParent = t.TypeOf<typeof listThreadsByParent>;

export const listThreadsByUser = t.type({
    userId,
    first: t.number,
    cursor: td.optionFromNullable(T.threadCursor),
});

export type ListThreadsByUser = t.TypeOf<typeof listThreadsByUser>;

export const deleteThreadInput = t.type({
    context: userContext,
    id: T.threadId,
});

export type DeleteThreadInput = t.TypeOf<typeof deleteThreadInput>;
