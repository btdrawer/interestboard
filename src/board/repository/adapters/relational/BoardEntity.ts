import {
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryKey,
    Property,
} from "@mikro-orm/core";
import * as NEA from "fp-ts/NonEmptyArray";
import * as B from "../../../types/Board";
import * as U from "../../../../user/types/User";

@Entity()
export class BoardModerator {
    @ManyToOne({ primary: true })
    boardId!: B.BoardId;

    @ManyToOne({ primary: true })
    userId!: U.UserId;
}

@Entity()
export class Board {
    @PrimaryKey()
    id!: B.BoardId;

    @Property()
    name!: string;

    @Property()
    title!: string;

    @Property()
    description?: string;

    @OneToMany(() => BoardModerator, (moderator) => moderator.boardId)
    moderators!: NEA.NonEmptyArray<BoardModerator>;

    @Property()
    subscribers!: number;

    @Property()
    locked!: boolean;

    @Property()
    created!: Date;

    @Property()
    updated!: Date;
}
