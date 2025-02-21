import * as U from "../../../contract/User";
import { FakeRepository } from "../../../../common/repository/adapters/fake/FakeRepository";

export class UserFakeRepository extends FakeRepository<U.UserId, U.User> {}
