import * as t from "io-ts";
import * as td from "io-ts-types";
import { v4 as uuidv4 } from "uuid";

export const userId = td.UUID;

export const user = t.type({
    id: userId,
    username: t.string,
    name: t.string,
    email: t.string,
    created: td.DateFromISOString,
    updated: td.DateFromISOString,
});

export type UserId = t.TypeOf<typeof userId>;
export type User = t.TypeOf<typeof user>;

export const generateUserId = (): UserId => uuidv4() as UserId;

/** UserContext */

export const userContext = t.type({
    userId: userId,
});

export type UserContext = t.TypeOf<typeof userContext>;
