import * as O from "fp-ts/Option";
import * as NEA from "fp-ts/NonEmptyArray";
import * as B from "../types/Board";
import * as BR from "./BoardRepository";
import * as U from "../../user/types/User";
import { PaginatedEntityFactory } from "../../common/repository/PaginatedRepository.abstract.spec";

export const boardEntityFactory: PaginatedEntityFactory<B.BoardId, B.Board> = {
    newId: () => B.generateBoardId(),
    newEntity: (id: B.BoardId) => ({
        id,
        name: "hello-world",
        title: "Hello, world!",
        description: O.some("This is a test board."),
        moderators: [U.generateUserId()] as NEA.NonEmptyArray<U.UserId>,
        subscribers: 0,
        locked: false,
        created: new Date(),
        updated: new Date(),
    }),
    updateEntity: (entity: B.Board) => ({
        ...entity,
        updated: new Date(),
    }),
    getId: BR.getId,
    getCursor: BR.getCursor,
};
