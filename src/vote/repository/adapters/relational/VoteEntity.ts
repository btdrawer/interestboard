import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import * as O from "fp-ts/Option";
import * as V from "../../../types/Vote";
import * as U from "../../../../user/types/User";
import * as T from "../../../../thread/types/Thread";

@Entity()
export class Vote {
    @PrimaryKey()
    id!: V.VoteId;

    @Property()
    userId!: U.UserId;

    @Property()
    threadId!: T.ThreadId;

    @Property()
    parentId?: T.ThreadId;

    @Property()
    type!: V.VoteType;

    @Property()
    created!: Date;

    @Property()
    updated!: Date;
}

export const fromVoteEntity = (entity: Vote): V.Vote => ({
    id: entity.id,
    userId: entity.userId,
    threadId: entity.threadId,
    parentId: O.fromNullable(entity.parentId),
    type: entity.type,
    created: entity.created,
    updated: entity.updated,
});

export const createVoteEntity = (id: V.VoteId, vote: V.Vote): Vote => {
    const entity = new Vote();
    entity.id = id;
    entity.userId = vote.userId;
    entity.threadId = vote.threadId;
    entity.parentId = O.toUndefined(vote.parentId);
    entity.type = vote.type;
    entity.created = vote.created;
    entity.updated = vote.updated;
    return entity;
};
