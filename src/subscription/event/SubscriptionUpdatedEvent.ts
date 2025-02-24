import * as t from "io-ts";
import * as E from "../../common/event/Event";
import * as S from "../types/Subscription";
import * as U from "../../user/types/User";
import * as B from "../../board/types/Board";

export const subscriptionUpdatedEventBody = t.type({
    userId: U.userId,
    boardId: B.boardId,
    type: S.boardSubscriptionType,
});

export type SubscriptionUpdatedEventBody = t.TypeOf<
    typeof subscriptionUpdatedEventBody
>;

export const subscriptionUpdatedEventDescriptor =
    E.event<SubscriptionUpdatedEventBody>(
        "SubscriptionUpdated",
        subscriptionUpdatedEventBody,
    );

export const subscriptionUpdatedEvent = (
    body: SubscriptionUpdatedEventBody,
    created: Date,
) => ({
    type: "SubscriptionUpdated",
    body,
    created,
});

export type SubscriptionUpdatedEvent = t.TypeOf<
    typeof subscriptionUpdatedEventDescriptor
>;
