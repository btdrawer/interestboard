import * as t from "io-ts";
import * as td from "io-ts-types";
import { v4 as uuidv4 } from "uuid";
import { userContext, userId } from "../../user/contract/User";

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

/** Inputs */

export const createBoardInput = t.type({
    context: userContext,
    name: t.string,
    title: t.string,
    description: td.optionFromNullable(t.string),
});

export type CreateBoardInput = t.TypeOf<typeof createBoardInput>;

export const updateModeratorsInput = t.type({
    add: t.array(userId),
    remove: t.array(userId),
});

export const updateBoardInput = t.type({
    context: userContext,
    id: boardId,
    name: t.string,
    title: t.string,
    description: td.optionFromNullable(t.string),
    moderators: updateModeratorsInput,
    locked: t.boolean,
});

export type UpdateBoardInput = t.TypeOf<typeof updateBoardInput>;

export const subscribeToBoardInput = t.type({
    context: userContext,
    id: boardId,
});

export type SubscribeToBoardInput = t.TypeOf<typeof subscribeToBoardInput>;

export const unsubscribeFromBoardInput = t.type({
    context: userContext,
    id: boardId,
});

export type UnsubscribeFromBoardInput = t.TypeOf<
    typeof unsubscribeFromBoardInput
>;

export const lockBoardInput = t.type({
    context: userContext,
    id: boardId,
});

export type LockBoardInput = t.TypeOf<typeof lockBoardInput>;
