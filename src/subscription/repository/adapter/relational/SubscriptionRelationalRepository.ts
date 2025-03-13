import * as t from "io-ts";
import * as NEA from "fp-ts/NonEmptyArray";
import { MikroORM } from "@mikro-orm/core";
import * as S from "../../../types/Subscription";
import {
    createSubscriptionEntity,
    fromSubscriptionEntity,
    Subscription as SubscriptionEntity,
} from "./SubscriptionEntity";
import { RelationalPaginatedRepository } from "../../../../common/repository/adapters/relational/RelationalPaginatedRepository";
import * as SR from "../../SubscriptionRepository";
import { BoardId } from "../../../../board/types/Board";
import { PaginationOptions } from "../../../../common/repository/PaginatedRepository";
import { RepositoryOutput } from "../../../../common/repository/RepositoryOutput";
import { UserId } from "../../../../user/types/User";
import {
    createSubscriptionUpdatedEventEntity,
    SubscriptionUpdatedEvent,
} from "../../../event/repository/adatpers/relational/SubscriptionUpdatedEventEntity";
import {
    subscriptionUpdatedEvent,
    SubscriptionUpdateType,
} from "../../../event/SubscriptionUpdatedEvent";

export const subscriptionUpdatedEventIdColumnName = "id";
export const subscriptionUpdatedEventCursorColumnNames = [
    "id",
    "created",
] as NEA.NonEmptyArray<string>;

export class SubscriptionRelationalRepository
    extends RelationalPaginatedRepository<
        S.BoardSubscriptionId,
        S.BoardSubscription,
        SubscriptionEntity
    >
    implements SR.SubscriptionRepository
{
    constructor(protected orm: MikroORM) {
        super(
            S.boardSubscriptionId
                .type as unknown as t.Type<S.BoardSubscriptionId>,
            SR.getId,
            subscriptionUpdatedEventIdColumnName,
            subscriptionUpdatedEventCursorColumnNames,
            orm,
            SubscriptionEntity,
        );
    }

    saveOperation(entity: SubscriptionEntity): Promise<void> {
        return this.orm.em.transactional(async () => {
            await this.entityRepository.upsert(this.createEntity(entity));
            await this.sendOutboxEvent(entity, SubscriptionUpdateType.Add);
        });
    }

    deleteOperation(id: S.BoardSubscriptionId): Promise<number> {
        return this.orm.em.transactional(async () => {
            const entity = await this.entityRepository.findOneOrFail(id);
            const result = await this.entityRepository.nativeDelete(entity.id);
            await this.sendOutboxEvent(entity, SubscriptionUpdateType.Delete);
            return result;
        });
    }

    private async sendOutboxEvent(
        entity: S.BoardSubscription,
        updateType: SubscriptionUpdateType,
    ) {
        const outbox = this.orm.em.getRepository(SubscriptionUpdatedEvent);
        await outbox.upsert(
            createSubscriptionUpdatedEventEntity(
                entity.id,
                subscriptionUpdatedEvent(
                    {
                        userId: entity.userId,
                        boardId: entity.boardId,
                        type: updateType,
                    },
                    entity.created,
                ),
            ),
        );
    }

    listSubscriptionsByBoard(
        boardId: BoardId,
        pagination: PaginationOptions,
    ): RepositoryOutput<S.BoardSubscriptionId, S.BoardSubscription[]> {
        return this.listWithFilters({ boardId }, pagination);
    }

    listSubscriptionsByUser(
        userId: UserId,
        pagination: PaginationOptions,
    ): RepositoryOutput<S.BoardSubscriptionId, S.BoardSubscription[]> {
        return this.listWithFilters({ userId }, pagination);
    }

    protected createEntity(
        subscription: S.BoardSubscription,
    ): SubscriptionEntity {
        return createSubscriptionEntity(this.getId(subscription), subscription);
    }

    protected fromEntity(entity: SubscriptionEntity): S.BoardSubscription {
        return fromSubscriptionEntity(entity);
    }
}
