import * as NEA from "fp-ts/NonEmptyArray";
import * as R from "../../common/repository/Repository";
import { PaginatedRepository } from "../../common/repository/PaginatedRepository";
import * as S from "../types/Subscription";
import * as B from "../../board/types/Board";
import * as U from "../../user/types/User";
import { RepositoryOutput } from "../../common/repository/RepositoryOutput";

export type SubscriptionRepository = R.Repository<
    S.BoardSubscriptionId,
    S.BoardSubscription
> &
    PaginatedRepository<
        S.BoardSubscriptionId,
        S.BoardSubscriptionCursor,
        S.BoardSubscription
    > & {
        listSubscriptionsByBoard(
            boardId: B.BoardId,
        ): RepositoryOutput<S.BoardSubscriptionId, S.BoardSubscription[]>;

        listSubscriptionsByUser(
            userId: U.UserId,
        ): RepositoryOutput<S.BoardSubscriptionId, S.BoardSubscription[]>;
    };

export const getId = (user: S.BoardSubscription): S.BoardSubscriptionId =>
    user.id;

export const getCursor = R.generateCursor<S.BoardSubscription>(
    (subscription) =>
        [
            subscription.id.toString(),
            subscription.created.toISOString(),
        ] as NEA.NonEmptyArray<string>,
);
