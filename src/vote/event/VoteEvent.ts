import * as t from "io-ts";
import * as E from "../../common/event/Event";
import * as V from "../types/Vote";
import * as U from "../../user/types/User";
import * as T from "../../thread/types/Thread";

export enum Action {
    Vote = "Vote",
    Unvote = "Unvote",
}

export const action = t.union([
    t.literal(Action.Vote),
    t.literal(Action.Unvote),
]);

export const voteEventBody = t.type({
    userId: U.userId,
    threadId: T.threadId,
    type: V.voteType,
    action,
});

export type VoteEventBody = t.TypeOf<typeof voteEventBody>;

export const voteEventDescriptor = E.event<VoteEventBody>(
    "Vote",
    voteEventBody as unknown as t.Type<VoteEventBody>,
);

export const voteEvent = (body: VoteEventBody, created: Date) => ({
    type: "Vote",
    body,
    created,
});

export type VoteEvent = t.TypeOf<typeof voteEventDescriptor>;
