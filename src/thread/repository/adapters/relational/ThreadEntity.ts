import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import * as T from "../../../types/Thread";
import * as U from "../../../../user/types/User";
import * as B from "../../../../board/types/Board";

@Entity()
export class Thread {
    @PrimaryKey()
    id!: T.ThreadId;

    @Property()
    authorId!: U.UserId;

    @Property()
    boardId!: B.BoardId;

    @Property()
    parentId?: T.ThreadId;

    @Property()
    body!: string;

    @Property()
    upvotes!: number;

    @Property()
    downvotes!: number;

    @Property()
    created!: Date;

    @Property()
    updated!: Date;

    @Property()
    deleted?: Date;
}
