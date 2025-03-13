import * as t from "io-ts";
import * as NEA from "fp-ts/NonEmptyArray";
import { MikroORM } from "@mikro-orm/core";
import * as S from "../../../../types/Subscription";
import * as SUE from "../../../SubscriptionUpdatedEvent";
import {
    createSubscriptionUpdatedEventEntity,
    fromSubscriptionUpdatedEventEntity,
    SubscriptionUpdatedEvent as SubscriptionUpdatedEventEntity,
} from "./SubscriptionUpdatedEventEntity";
import { RelationalPaginatedRepository } from "../../../../../common/repository/adapters/relational/RelationalPaginatedRepository";
import * as SUER from "../../SubscriptionUpdatedEventRepository";

export const subscriptionUpdatedEventIdColumnName = "id";
export const subscriptionUpdatedEventCursorColumnNames = [
    "id",
    "created",
] as NEA.NonEmptyArray<string>;

export class SubscriptionUpdatedEventRelationalRepository
    extends RelationalPaginatedRepository<
        S.BoardSubscriptionId,
        SUE.SubscriptionUpdatedEvent,
        SubscriptionUpdatedEventEntity
    >
    implements SUER.SubscriptionUpdatedEventRepository
{
    constructor(protected orm: MikroORM) {
        super(
            S.boardSubscriptionId
                .type as unknown as t.Type<S.BoardSubscriptionId>,
            SUER.getId,
            subscriptionUpdatedEventIdColumnName,
            subscriptionUpdatedEventCursorColumnNames,
            orm,
            SubscriptionUpdatedEventEntity,
        );
    }

    protected createEntity(
        subscriptionUpdatedEvent: SUE.SubscriptionUpdatedEvent,
    ): SubscriptionUpdatedEventEntity {
        return createSubscriptionUpdatedEventEntity(
            SUER.getId(subscriptionUpdatedEvent),
            subscriptionUpdatedEvent,
        );
    }

    protected fromEntity(
        entity: SubscriptionUpdatedEventEntity,
    ): SUE.SubscriptionUpdatedEvent {
        return fromSubscriptionUpdatedEventEntity(entity);
    }
}
