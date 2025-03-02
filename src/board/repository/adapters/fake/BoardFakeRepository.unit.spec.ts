import * as B from "../../../types/Board";
import { BoardFakeRepository } from "./BoardFakeRepository";
import { boardRepositoryTest } from "../../BoardRepository.abstract.spec";

describe("BoardFakeRepository", () => {
    boardRepositoryTest(
        () => new BoardFakeRepository(new Map<B.BoardId, B.Board>()),
    );
});
