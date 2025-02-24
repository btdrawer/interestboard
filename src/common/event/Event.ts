import * as t from "io-ts";
import * as td from "io-ts-types";

export const event = <T>(type: string, bodyType: t.Type<T>) =>
    t.type({
        type: t.literal(type),
        body: bodyType,
        created: td.DateFromISOString,
    });

export type Event<T> = t.TypeOf<ReturnType<typeof event<T>>>;
