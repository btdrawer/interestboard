import * as t from "io-ts";
import * as O from "fp-ts/Option";
import { FakePaginatedRepository } from "../../../../common/repository/adapters/fake/FakePaginatedRepository";
import { PaginationOptions } from "../../../../common/repository/PaginatedRepository";
import { RepositoryOutput } from "../../../../common/repository/RepositoryOutput";
import * as T from "../../../types/Thread";
import * as TR from "../../ThreadRepository";
import { UserId } from "../../../../user/types/User";

export class ThreadFakeRepository
    extends FakePaginatedRepository<T.ThreadId, T.Thread>
    implements TR.ThreadRepository
{
    constructor(protected entities: Map<T.ThreadId, T.Thread>) {
        super(
            entities,
            T.threadId.type as unknown as t.Type<T.ThreadId>, // TODO: Fix io-ts types
            TR.getId,
            TR.getCursor,
        );
    }

    listByParentId(
        parentId: O.Option<T.ThreadId>,
        pagination: PaginationOptions,
    ): RepositoryOutput<T.ThreadId, T.Thread[]> {
        return this.listWithFilter((t) => t.parentId === parentId)(pagination);
    }

    listByUserId(
        userId: UserId,
        pagination: PaginationOptions,
    ): RepositoryOutput<T.ThreadId, T.Thread[]> {
        return this.listWithFilter((t) => t.authorId === userId)(pagination);
    }
}
