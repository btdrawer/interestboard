import * as t from "io-ts";
import * as td from "io-ts-types";
import { v4 as uuidv4 } from "uuid";
import { userId } from "../../user/types/User";
import { boardId } from "../../board/types/Board";

export const threadId = td.UUID;
export const threadCursor = t.string;

export const thread = t.type({
    id: threadId,
    authorId: userId,
    boardId,
    parentId: td.optionFromNullable(threadId),
    body: t.string,
    upvotes: t.number,
    downvotes: t.number,
    created: td.DateFromISOString,
    updated: td.DateFromISOString,
    deleted: td.optionFromNullable(td.DateFromISOString),
});

export type ThreadId = t.TypeOf<typeof threadId>;
export type ThreadCursor = t.TypeOf<typeof threadCursor>;
export type Thread = t.TypeOf<typeof thread>;

export const generateThreadId = (): ThreadId => uuidv4() as ThreadId;
