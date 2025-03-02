import * as t from "io-ts";
import * as TE from "fp-ts/TaskEither";
import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/function";
import * as NEA from "fp-ts/NonEmptyArray";
import { EntityData, MikroORM, raw } from "@mikro-orm/core";
import * as B from "../../../types/Board";
import { Board as BoardEntity, BoardModerator } from "./BoardEntity";
import * as U from "../../../../user/types/User";
import { RelationalPaginatedRepository } from "../../../../common/repository/adapters/relational/RelationalPaginatedRepository";
import * as RE from "../../../../common/repository/RepositoryError";
import * as BR from "../../BoardRepository";
import { RepositoryOutput } from "../../../../common/repository/RepositoryOutput";

export const boardIdColumnName = "id";
export const boardCursorColumnNames = [
    "id",
    "created",
] as NEA.NonEmptyArray<string>;

export class BoardRelationalRepository
    extends RelationalPaginatedRepository<B.BoardId, B.Board, BoardEntity>
    implements BR.BoardRepository
{
    constructor(protected orm: MikroORM) {
        super(
            B.boardId.type as unknown as t.Type<B.BoardId>,
            BR.getId,
            boardIdColumnName,
            boardCursorColumnNames,
            orm,
            BoardEntity,
        );
    }

    addSubscriber(id: B.BoardId): RepositoryOutput<B.BoardId, B.Board> {
        return pipe(
            this.handleUpdate(id, { subscribers: raw("subscribers + 1") }),
            TE.map(this.fromEntity),
        );
    }

    removeSubscriber(id: B.BoardId): RepositoryOutput<B.BoardId, B.Board> {
        return pipe(
            this.handleUpdate(id, { subscribers: raw("subscribers - 1") }),
            TE.map(this.fromEntity),
        );
    }

    private handleUpdate(id: B.BoardId, data: EntityData<BoardEntity>) {
        return this.callOrm([id], async () => {
            await this.orm.em.begin();
            const result = await this.orm.em.nativeUpdate(
                BoardEntity,
                { id },
                data,
            );
            if (result === 1) {
                await this.orm.em.rollback();
                return Promise.reject(RE.entityNotFoundError([id]));
            }
            const entity = await this.entityRepository.findOne({ id });
            if (!entity) {
                await this.orm.em.rollback();
                return Promise.reject(RE.entityNotFoundError([id]));
            }
            await this.orm.em.commit();
            return entity;
        });
    }

    protected createEntity(board: B.Board): BoardEntity {
        const entity = new BoardEntity();
        entity.id = this.getId(board);
        entity.name = board.name;
        entity.title = board.title;
        entity.description = O.toUndefined(board.description);
        entity.moderators = board.moderators.map((moderatorId) => ({
            boardId: entity.id,
            userId: moderatorId,
        })) as NEA.NonEmptyArray<BoardModerator>;
        entity.subscribers = board.subscribers;
        entity.locked = board.locked;
        entity.created = board.created;
        entity.updated = board.updated;
        return entity;
    }

    protected fromEntity(entity: BoardEntity): B.Board {
        return {
            id: entity.id,
            name: entity.name,
            title: entity.title,
            description: O.fromNullable(entity.description),
            moderators: entity.moderators.map(
                (moderator) => moderator.userId,
            ) as NEA.NonEmptyArray<U.UserId>,
            subscribers: entity.subscribers,
            locked: entity.locked,
            created: entity.created,
            updated: entity.updated,
        };
    }
}
