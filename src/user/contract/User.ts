import * as t from "io-ts";
import * as td from "io-ts-types";

export const userId = td.UUID;
export const userCursor = t.string;

export const user = t.type({
    id: userId,
    username: t.string,
});

export type UserId = t.TypeOf<typeof userId>;
export type UserCursor = t.TypeOf<typeof userCursor>;
export type User = t.TypeOf<typeof user>;

export const userContext = t.type({
    userId: userId,
});

export type UserContext = t.TypeOf<typeof userContext>;
