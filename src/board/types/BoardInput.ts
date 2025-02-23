import * as t from "io-ts";
import * as td from "io-ts-types";
import * as B from "./Board";
import { userContext, userId } from "../../user/types/User";

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
    id: B.boardId,
    name: t.string,
    title: t.string,
    description: td.optionFromNullable(t.string),
    moderators: updateModeratorsInput,
    locked: t.boolean,
});

export type UpdateBoardInput = t.TypeOf<typeof updateBoardInput>;

export const subscribeToBoardInput = t.type({
    context: userContext,
    id: B.boardId,
});

export type SubscribeToBoardInput = t.TypeOf<typeof subscribeToBoardInput>;

export const unsubscribeFromBoardInput = t.type({
    context: userContext,
    id: B.boardId,
});

export type UnsubscribeFromBoardInput = t.TypeOf<
    typeof unsubscribeFromBoardInput
>;

export const lockBoardInput = t.type({
    context: userContext,
    id: B.boardId,
});

export type LockBoardInput = t.TypeOf<typeof lockBoardInput>;
