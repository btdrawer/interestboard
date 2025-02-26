import * as t from "io-ts";
import { FakePaginatedRepository } from "../../../../common/repository/adapters/fake/FakePaginatedRepository";
import * as B from "../../../types/Board";
import * as BR from "../../BoardRepository";
import { RepositoryOutput } from "../../../../common/repository/RepositoryOutput";

export class BoardFakeRepository
    extends FakePaginatedRepository<B.BoardId, B.BoardCursor, B.Board>
    implements BR.BoardRepository
{
    constructor(protected entities: Map<B.BoardId, B.Board>) {
        super(
            entities,
            B.boardId.type as unknown as t.Type<B.BoardId>, // TODO: Fix io-ts types
            BR.getId,
            BR.getCursor,
        );
    }

    addSubscriber(id: B.BoardId): RepositoryOutput<B.BoardId, B.Board> {
        throw new Error("Method not implemented.");
    }

    removeSubscriber(id: B.BoardId): RepositoryOutput<B.BoardId, B.Board> {
        throw new Error("Method not implemented.");
    }
}
