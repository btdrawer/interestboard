import * as T from "../../../types/Thread";
import { ThreadFakeRepository } from "./ThreadFakeRepository";
import { threadRepositoryTest } from "../../ThreadRepository.abstract.spec";

describe("ThreadFakeRepository", () => {
    threadRepositoryTest(
        () => new ThreadFakeRepository(new Map<T.ThreadId, T.Thread>()),
    );
});
