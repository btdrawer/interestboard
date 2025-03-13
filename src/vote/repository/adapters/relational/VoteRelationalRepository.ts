import * as t from "io-ts";
import * as NEA from "fp-ts/NonEmptyArray";
import { MikroORM } from "@mikro-orm/core";
import * as V from "../../../types/Vote";
import * as VE from "./VoteEntity";
import * as VR from "../../VoteRepository";
import { RelationalPaginatedRepository } from "../../../../common/repository/adapters/relational/RelationalPaginatedRepository";
import {
    createVoteEventEntity,
    VoteEvent,
} from "../../../event/repository/adapters/relational/VoteEventEntity";
import { Action, voteEvent } from "../../../event/VoteEvent";
import { RepositoryOutput } from "../../../../common/repository/RepositoryOutput";
import { ThreadId } from "../../../../thread/types/Thread";
import { UserId } from "../../../../user/types/User";

export const voteUpdatedEventIdColumnName = "id";
export const voteUpdatedEventCursorColumnNames = [
    "id",
    "created",
] as NEA.NonEmptyArray<string>;

export class VoteRelationalRepository
    extends RelationalPaginatedRepository<V.VoteId, V.Vote, VE.Vote>
    implements VR.VoteRepository
{
    constructor(protected orm: MikroORM) {
        super(
            V.voteId.type as unknown as t.Type<V.VoteId>,
            VR.getId,
            voteUpdatedEventIdColumnName,
            voteUpdatedEventCursorColumnNames,
            orm,
            VE.Vote,
        );
    }

    saveOperation(entity: VE.Vote): Promise<void> {
        return this.orm.em.transactional(async () => {
            await this.entityRepository.upsert(entity);
            await this.sendOutboxEvent(entity, Action.Vote);
        });
    }

    deleteOperation(id: V.VoteId): Promise<number> {
        return this.orm.em.transactional(async () => {
            const entity = await this.entityRepository.findOneOrFail(id);
            const result = await this.entityRepository.nativeDelete(entity.id);
            await this.sendOutboxEvent(entity, Action.Unvote);
            return result;
        });
    }

    private async sendOutboxEvent(entity: VE.Vote, action: Action) {
        const outbox = this.orm.em.getRepository(VoteEvent);
        await outbox.upsert(
            createVoteEventEntity(
                entity.id,
                voteEvent(
                    {
                        userId: entity.userId,
                        threadId: entity.threadId,
                        type: entity.type,
                        action,
                    },
                    entity.created,
                ),
            ),
        );
    }

    listVotesByUserIdAndThreadId(
        userId: UserId,
        threadId: ThreadId,
    ): RepositoryOutput<V.VoteId, V.Vote[]> {
        throw new Error("Method not implemented.");
    }

    protected createEntity(vote: V.Vote): VE.Vote {
        return VE.createVoteEntity(this.getId(vote), vote);
    }

    protected fromEntity(entity: VE.Vote): V.Vote {
        return VE.fromVoteEntity(entity);
    }
}
