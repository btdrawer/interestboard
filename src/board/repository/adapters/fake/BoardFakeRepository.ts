import * as t from "io-ts";
import { FakePaginatedRepository } from "../../../../common/repository/adapters/fake/FakePaginatedRepository";
import { PaginationOptions } from "../../../../common/repository/PaginatedRepository";
import { RepositoryOutput } from "../../../../common/repository/RepositoryOutput";
import { PostId } from "../../../../post/types/Post";
import * as B from "../../../types/Board";
import * as BR from "../../BoardRepository";
import { UserId } from "../../../../user/types/User";

export class BoardFakeRepository
    extends FakePaginatedRepository<B.BoardId, B.BoardCursor, B.Board>
    implements BR.BoardRepository
{
    constructor() {
        super(
            B.boardId.type as unknown as t.Type<B.BoardId>, // TODO: Fix io-ts types
            BR.getId,
            BR.getCursor,
        );
    }
}
