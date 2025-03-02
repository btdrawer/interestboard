import * as T from "../../../types/Thread";
import { ThreadFakeRepository } from "./ThreadFakeRepository";
import { threadEntityFactory } from "../../ThreadEntityFactory.util.spec";
import { repositoryTest } from "../../../../common/repository/Repository.abstract.spec";

describe("ThreadFakeRepository", () => {
    repositoryTest<T.ThreadId, T.Thread>(
        () => new ThreadFakeRepository(new Map<T.ThreadId, T.Thread>()),
        threadEntityFactory,
    );
});
