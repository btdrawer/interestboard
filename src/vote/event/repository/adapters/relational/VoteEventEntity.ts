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
}
