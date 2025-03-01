import * as U from "../../../types/User";
import { UserFakeRepository } from "./UserFakeRepository";
import { userEntityFactory } from "../../UserEntityFactory.util.spec";
import { repositoryTest } from "../../../../common/repository/Repository.abstract.spec";

describe("UserFakeRepository", () => {
    repositoryTest<U.UserId, U.User>(
        () => new UserFakeRepository(new Map<U.UserId, U.User>()),
        userEntityFactory,
    );
});
