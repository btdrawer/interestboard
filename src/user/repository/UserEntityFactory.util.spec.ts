import * as U from "../types/User";
import { EntityFactory } from "../../common/repository/Repository.abstract.spec";

export const userEntityFactory: EntityFactory<U.UserId, U.User> = {
    newId: () => U.generateUserId(),
    newEntity: (id: U.UserId) => ({
        id,
        username: "me",
        name: "John Doe",
        email: "john@example.com",
        created: new Date(),
        updated: new Date(),
    }),
    updateEntity: (entity: U.User) => ({
        ...entity,
        name: "Jane Doe",
        updated: new Date(),
    }),
};
