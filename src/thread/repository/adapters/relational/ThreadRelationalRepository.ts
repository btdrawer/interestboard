import * as t from "io-ts";
import * as TE from "fp-ts/TaskEither";
import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/function";
import * as NEA from "fp-ts/NonEmptyArray";
import { MikroORM } from "@mikro-orm/core";
import * as T from "../../../types/Thread";
import { Thread as ThreadEntity } from "./ThreadEntity";
import { RelationalPaginatedRepository } from "../../../../common/repository/adapters/relational/RelationalPaginatedRepository";
import * as TR from "../../ThreadRepository";
import { RepositoryOutput } from "../../../../common/repository/RepositoryOutput";
import { PaginationOptions } from "../../../../common/repository/PaginatedRepository";
import { UserId } from "../../../../user/types/User";

const threadIdColumnName = "id";
const threadCursorColumnNames = ["id", "created"] as NEA.NonEmptyArray<string>;

export class ThreadRelationalRepository
    extends RelationalPaginatedRepository<T.ThreadId, T.Thread, ThreadEntity>
    implements TR.ThreadRepository
{
    constructor(protected orm: MikroORM) {
        super(
            T.threadId.type as unknown as t.Type<T.ThreadId>,
            TR.getId,
            threadIdColumnName,
            threadCursorColumnNames,
            orm,
            ThreadEntity,
        );
    }

    listByParentId(
        parentId: O.Option<T.ThreadId>,
        options: PaginationOptions,
    ): RepositoryOutput<T.ThreadId, T.Thread[]> {
        const filters = {
            ...O.getOrElse(() => ({}))(
                O.map((id) => ({ parentId: id }))(parentId),
            ),
            ...O.getOrElse(() => ({}))(
                O.map(this.getFiltersFromCursor)(options.cursor),
            ),
        };
        return pipe(
            this.callOrm([], () =>
                this.entityRepository.find(filters, { limit: options.first }),
            ),
            TE.map((entities) => entities.map(this.fromEntity)),
        );
    }

    listByUserId(
        userId: UserId,
        options: PaginationOptions,
    ): RepositoryOutput<T.ThreadId, T.Thread[]> {
        const filters = {
            authorId: userId,
            ...O.getOrElse(() => ({}))(
                O.map(this.getFiltersFromCursor)(options.cursor),
            ),
        };
        return pipe(
            this.callOrm([], () =>
                this.entityRepository.find(filters, { limit: options.first }),
            ),
            TE.map((entities) => entities.map(this.fromEntity)),
        );
    }

    protected createEntity(thread: T.Thread): ThreadEntity {
        const entity = new ThreadEntity();
        entity.id = this.getId(thread);
        entity.authorId = thread.authorId;
        entity.boardId = thread.boardId;
        entity.parentId = O.toUndefined(thread.parentId);
        entity.body = thread.body;
        entity.upvotes = thread.upvotes;
        entity.downvotes = thread.downvotes;
        entity.created = thread.created;
        entity.updated = thread.updated;
        entity.deleted = O.toUndefined(thread.deleted);
        return entity;
    }

    protected fromEntity(entity: ThreadEntity): T.Thread {
        return {
            id: entity.id,
            authorId: entity.authorId,
            boardId: entity.boardId,
            parentId: O.fromNullable(entity.parentId),
            body: entity.body,
            upvotes: entity.upvotes,
            downvotes: entity.downvotes,
            created: entity.created,
            updated: entity.updated,
            deleted: O.fromNullable(entity.deleted),
        };
    }
}
