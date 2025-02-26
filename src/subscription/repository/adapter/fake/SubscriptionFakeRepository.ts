import * as t from "io-ts";
import * as TE from "fp-ts/TaskEither";
import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/function";
import * as S from "../../../types/Subscription";
import * as SR from "../../SubscriptionRepository";
import * as B from "../../../../board/types/Board";
import { FakePaginatedRepository } from "../../../../common/repository/adapters/fake/FakePaginatedRepository";
import { RepositoryOutput } from "../../../../common/repository/RepositoryOutput";
import * as RE from "../../../../common/repository/RepositoryError";
import { UserId } from "../../../../user/types/User";
import { PaginationOptions } from "../../../../common/repository/PaginatedRepository";

export class SubscriptionFakeRepository
    extends FakePaginatedRepository<
        S.BoardSubscriptionId,
        S.BoardSubscriptionCursor,
        S.BoardSubscription
    >
    implements SR.SubscriptionRepository
{
    // provide board entities here to simulate foreign key constraints
    // using foreign key constraints is dubious from a DDD point of view, but efficient and still fairly clean
    constructor(
        protected entities: Map<S.BoardSubscriptionId, S.BoardSubscription>,
        protected boardEntities: Map<B.BoardId, B.Board>,
    ) {
        super(
            entities,
            S.boardSubscriptionId
                .type as unknown as t.Type<S.BoardSubscriptionId>, // TODO: Fix io-ts types
            SR.getId,
            SR.getCursor,
        );
    }

    save(
        entity: S.BoardSubscription,
    ): RepositoryOutput<S.BoardSubscriptionId, S.BoardSubscription> {
        return pipe(
            TE.Do,
            TE.chain(() =>
                O.fold(
                    () =>
                        TE.left(
                            RE.badRequestError(
                                [entity.boardId],
                                "Board not found.",
                            ),
                        ),
                    () => TE.right(undefined),
                )(O.fromNullable(this.boardEntities.get(entity.boardId))),
            ),
            TE.chain(() => super.save(entity)),
        );
    }

    listSubscriptionsByBoard(
        boardId: B.BoardId,
        pagination: PaginationOptions<S.BoardSubscriptionCursor>,
    ): RepositoryOutput<S.BoardSubscriptionId, S.BoardSubscription[]> {
        return this.listWithFilter((entity) => entity.boardId === boardId)(
            pagination,
        );
    }

    listSubscriptionsByUser(
        userId: UserId,
        pagination: PaginationOptions<S.BoardSubscriptionCursor>,
    ): RepositoryOutput<S.BoardSubscriptionId, S.BoardSubscription[]> {
        return this.listWithFilter((entity) => entity.userId === userId)(
            pagination,
        );
    }
}
