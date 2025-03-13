import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import * as S from "../../../types/Subscription";
import * as U from "../../../../user/types/User";
import * as B from "../../../../board/types/Board";

@Entity()
export class Subscription {
    @PrimaryKey()
    id!: S.BoardSubscriptionId;

    @Property()
    userId!: U.UserId;

    @Property()
    boardId!: B.BoardId;

    @Property()
    created!: Date;
}

export const fromSubscriptionEntity = (
    entity: Subscription,
): S.BoardSubscription => ({
    id: entity.id,
    userId: entity.userId,
    boardId: entity.boardId,
    created: entity.created,
});

export const createSubscriptionEntity = (
    id: S.BoardSubscriptionId,
    subscription: S.BoardSubscription,
): Subscription => {
    const entity = new Subscription();
    entity.id = id;
    entity.userId = subscription.userId;
    entity.boardId = subscription.boardId;
    entity.created = subscription.created;
    return entity;
};
