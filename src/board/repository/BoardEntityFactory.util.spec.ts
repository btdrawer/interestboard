import * as O from "fp-ts/Option";
import * as NEA from "fp-ts/NonEmptyArray";
import * as B from "../types/Board";
import * as U from "../../user/types/User";
import { EntityFactory } from "../../common/repository/Repository.abstract.spec";

export const commentEntityFactory: EntityFactory<B.BoardId, B.Board> = {
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
};
