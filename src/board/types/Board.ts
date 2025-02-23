import * as t from "io-ts";
import * as td from "io-ts-types";
import { v4 as uuidv4 } from "uuid";
import { userId } from "../../user/types/User";

export const boardId = td.UUID;
export const boardCursor = t.string;

export const board = t.type({
    id: boardId,
    name: t.string,
    title: t.string,
    description: td.optionFromNullable(t.string),
    moderators: td.nonEmptyArray(userId),
    subscribers: t.number,
    locked: t.boolean,
    created: td.DateFromISOString,
    updated: td.DateFromISOString,
});

export type BoardId = t.TypeOf<typeof boardId>;
export type BoardCursor = t.TypeOf<typeof boardCursor>;
export type Board = t.TypeOf<typeof board>;

export const generateBoardId = (): BoardId => uuidv4() as BoardId;
