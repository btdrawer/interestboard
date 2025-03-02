import * as O from "fp-ts/Option";
import * as T from "../types/Thread";
import * as TR from "./ThreadRepository";
import * as U from "../../user/types/User";
import * as B from "../../board/types/Board";
import { PaginatedEntityFactory } from "../../common/repository/PaginatedRepository.abstract.spec";

export const threadEntityFactory: PaginatedEntityFactory<T.ThreadId, T.Thread> =
    {
        newId: () => T.generateThreadId(),
        newEntity: (id: T.ThreadId) => ({
            id,
            authorId: U.generateUserId(),
            boardId: B.generateBoardId(),
            parentId: O.none,
            body: "Hello, world!",
            upvotes: 0,
            downvotes: 0,
            created: new Date(),
            updated: new Date(),
            deleted: O.none,
        }),
        updateEntity: (entity: T.Thread) => ({
            ...entity,
            body: "Hello, universe!",
            updated: new Date(),
        }),
        getId: TR.getId,
        getCursor: TR.getCursor,
    };
