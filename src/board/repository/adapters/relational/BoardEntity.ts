import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import * as NEA from "fp-ts/NonEmptyArray";
import * as B from "../../../types/Board";
import * as U from "../../../../user/types/User";

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

    @Property()
    moderators!: NEA.NonEmptyArray<U.UserId>;

    @Property()
    subscribers!: number;

    @Property()
    locked!: boolean;

    @Property()
    created!: Date;

    @Property()
    updated!: Date;
}
