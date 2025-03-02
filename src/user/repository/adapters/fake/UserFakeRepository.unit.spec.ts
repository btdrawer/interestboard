import * as U from "../../../types/User";
import { UserFakeRepository } from "./UserFakeRepository";
import { userRepositoryTest } from "../../UserRepository.abstract.spec";

describe("UserFakeRepository", () => {
    userRepositoryTest(
        () => new UserFakeRepository(new Map<U.UserId, U.User>()),
    );
});
