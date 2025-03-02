import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import * as U from "../../../types/User";

@Entity()
export class User {
    @PrimaryKey()
    id!: U.UserId;

    @Property()
    username!: string;

    @Property()
    name!: string;

    @Property()
    email!: string;

    @Property()
    created!: Date;

    @Property()
    updated!: Date;
}
