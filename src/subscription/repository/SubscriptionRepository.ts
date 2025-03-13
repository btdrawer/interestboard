import * as NEA from "fp-ts/NonEmptyArray";
import * as R from "../../common/repository/Repository";
import {
    PaginatedRepository,
    PaginationOptions,
} from "../../common/repository/PaginatedRepository";
import * as S from "../types/Subscription";
import * as B from "../../board/types/Board";
import * as U from "../../user/types/User";
import { RepositoryOutput } from "../../common/repository/RepositoryOutput";

export type SubscriptionRepository = R.Repository<
    S.BoardSubscriptionId,
    S.BoardSubscription
> &
    PaginatedRepository<S.BoardSubscriptionId, S.BoardSubscription> & {
        listSubscriptionsByBoard(
            boardId: B.BoardId,
            pagination: PaginationOptions,
        ): RepositoryOutput<S.BoardSubscriptionId, S.BoardSubscription[]>;

        listSubscriptionsByUser(
            userId: U.UserId,
            pagination: PaginationOptions,
        ): RepositoryOutput<S.BoardSubscriptionId, S.BoardSubscription[]>;
    };

export const getId = (
    subscription: S.BoardSubscription,
): S.BoardSubscriptionId => subscription.id;

export const getCursor = R.generateCursor<S.BoardSubscription>(
    (subscription) =>
        [
            subscription.id.toString(),
            subscription.created.toISOString(),
        ] as NEA.NonEmptyArray<string>,
);
