import * as U from "../types/User";
import * as UR from "./UserRepository";
import { PaginatedEntityFactory } from "../../common/repository/PaginatedRepository.abstract.spec";

export const userEntityFactory: PaginatedEntityFactory<U.UserId, U.User> = {
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
    getId: UR.getId,
    getCursor: UR.getCursor,
};
