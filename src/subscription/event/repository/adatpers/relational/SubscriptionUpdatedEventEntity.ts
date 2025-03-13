import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import * as S from "../../../../types/Subscription";
import * as SUE from "../../../SubscriptionUpdatedEvent";
import * as U from "../../../../../user/types/User";
import * as B from "../../../../../board/types/Board";

@Entity()
export class SubscriptionUpdatedEvent {
    @PrimaryKey()
    id!: S.BoardSubscriptionId;

    @Property()
    userId!: U.UserId;

    @Property()
    boardId!: B.BoardId;

    @Property()
    type!: SUE.SubscriptionUpdateType;

    @Property()
    created!: Date;
}

export const createSubscriptionUpdatedEventEntity = (
    id: S.BoardSubscriptionId,
    subscriptionUpdatedEvent: SUE.SubscriptionUpdatedEvent,
): SubscriptionUpdatedEvent => {
    const entity = new SubscriptionUpdatedEvent();
    entity.id = id;
    entity.userId = subscriptionUpdatedEvent.body.userId;
    entity.boardId = subscriptionUpdatedEvent.body.boardId;
    entity.type = subscriptionUpdatedEvent.body.type;
    entity.created = subscriptionUpdatedEvent.created;
    return entity;
};

export const fromSubscriptionUpdatedEventEntity = (
    entity: SubscriptionUpdatedEvent,
): SUE.SubscriptionUpdatedEvent => {
    return SUE.subscriptionUpdatedEvent(
        {
            userId: entity.userId,
            boardId: entity.boardId,
            type: entity.type,
        },
        entity.created,
    );
};
