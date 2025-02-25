import * as t from "io-ts";
import * as E from "../../common/event/Event";
import * as U from "../../user/types/User";
import * as B from "../../board/types/Board";

export enum SubscriptionUpdateType {
    Add = "Add",
    Delete = "Delete",
}

export const subscriptionUpdateType = t.union([
    t.literal(SubscriptionUpdateType.Add),
    t.literal(SubscriptionUpdateType.Delete),
]);

export const subscriptionUpdatedEventBody = t.type({
    userId: U.userId,
    boardId: B.boardId,
    type: subscriptionUpdateType,
});

export type SubscriptionUpdatedEventBody = t.TypeOf<
    typeof subscriptionUpdatedEventBody
>;

export const subscriptionUpdatedEventDescriptor =
    E.event<SubscriptionUpdatedEventBody>(
        "SubscriptionUpdated",
        subscriptionUpdatedEventBody as unknown as t.Type<SubscriptionUpdatedEventBody>,
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
