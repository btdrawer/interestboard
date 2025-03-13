import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import * as V from "../../../../types/Vote";
import * as VE from "../../../VoteEvent";
import * as U from "../../../../../user/types/User";
import * as T from "../../../../../thread/types/Thread";

@Entity()
export class VoteEvent {
    @PrimaryKey()
    id!: V.VoteId;

    // TODO add relationships
    @Property()
    userId!: U.UserId;

    @Property()
    threadId!: T.ThreadId;

    @Property()
    type!: V.VoteType;

    @Property()
    action!: VE.Action;

    @Property()
    created!: Date;
}

export const createVoteEventEntity = (
    id: V.VoteId,
    vote: VE.VoteEvent,
): VoteEvent => {
    const entity = new VoteEvent();
    entity.id = id;
    entity.userId = vote.body.userId;
    entity.threadId = vote.body.threadId;
    entity.type = vote.body.type;
    entity.action = vote.body.action;
    return entity;
};

export const fromVoteEntity = (entity: VoteEvent): VE.VoteEvent => {
    return VE.voteEvent(
        {
            userId: entity.userId,
            threadId: entity.threadId,
            type: entity.type,
            action: entity.action,
        },
        entity.created,
    );
};
