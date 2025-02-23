import * as t from "io-ts";

export const createUserInput = t.type({
    username: t.string,
    name: t.string,
    email: t.string,
});

export type CreateUserInput = t.TypeOf<typeof createUserInput>;
