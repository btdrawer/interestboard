import * as TE from "fp-ts/TaskEither";
import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/function";
import { FacadeOutput } from "../../common/facade/FacadeOutput";
import * as S from "../types/Subscription";
import * as SI from "../types/SubscriptionInput";
import * as SE from "../types/SubscriptionError";
import { SubscriptionFacade } from "../facade/SubscriptionFacade";
import { SubscriptionRepository } from "../repository/SubscriptionRepository";
import { UserFacade } from "../../user/facade/UserFacade";
import { BoardFacade } from "../../board/facade/BoardFacade";
import * as RE from "../../common/repository/RepositoryError";
import { RepositoryOutput } from "../../common/repository/RepositoryOutput";

export const repositoryErrorToSubscriptionError = (
    repositoryError: RE.RepositoryError<S.BoardSubscriptionId>,
): SE.SubscriptionError => {
    if (
        RE.isRepositoryNotFoundError(
            repositoryError,
            S.boardSubscriptionId.type,
        )
    ) {
        return SE.subscriptionNotFoundError(repositoryError.ids, O.none);
    }
    return SE.subscriptionInternalError(repositoryError.ids, O.none);
};

export class SubscriptionDomain implements SubscriptionFacade {
    constructor(
        private repository: SubscriptionRepository,
        private userFacade: UserFacade,
        private boardFacade: BoardFacade,
    ) {}

    listSubscriptionsByBoard(
        input: SI.ListSubscriptionsByBoardInput,
    ): FacadeOutput<S.BoardSubscription[]> {
        return pipe(
            TE.Do,
            TE.chain(() => this.boardFacade.get(input.id)),
            TE.chain(() =>
                this.callRepository(
                    this.repository.listSubscriptionsByBoard(input.id),
                ),
            ),
        );
    }

    listSubscriptionsByUser(
        input: SI.ListSubscriptionsByUserInput,
    ): FacadeOutput<S.BoardSubscription[]> {
        return pipe(
            TE.Do,
            TE.chain(() => this.userFacade.get(input.id)),
            TE.chain(() =>
                this.callRepository(
                    this.repository.listSubscriptionsByUser(input.id),
                ),
            ),
        );
    }

    subscribe(
        input: SI.SubscribeToBoardInput,
    ): FacadeOutput<S.BoardSubscription> {
        return pipe(
            TE.Do,
            TE.chain(() => this.userFacade.getFromContext(input.context)),
            TE.chain(() => this.callRepository(this.repository.find(input.id))),
            TE.chain(() => this.boardFacade.get(input.id)),
            TE.bind("subscription", () =>
                this.callRepository(
                    this.repository.save({
                        id: S.getBoardSubscriptionId(
                            input.context.userId,
                            input.id,
                        ),
                        userId: input.context.userId,
                        boardId: input.id,
                        created: new Date(),
                    }),
                ),
            ),
            // So the number of subscribers can be easily displayed. Fine being eventually consistent?
            // TODO Maybe make this transactional (turn subscribers into an aggregate?)
            TE.bind("boardUpdate", () =>
                this.boardFacade.addSubscriber(input.id),
            ),
            TE.map(({ subscription }) => subscription),
        );
    }

    unsubscribe(input: SI.UnsubscribeFromBoardInput): FacadeOutput<void> {
        return pipe(
            TE.Do,
            TE.chain(() => this.userFacade.getFromContext(input.context)),
            TE.chain(() =>
                this.callRepository(
                    this.repository.delete(
                        S.getBoardSubscriptionId(
                            input.context.userId,
                            input.id,
                        ),
                    ),
                ),
            ),
            TE.chain(() => this.boardFacade.removeSubscriber(input.id)),
            TE.map(() => undefined),
        );
    }

    private callRepository<T>(
        output: RepositoryOutput<S.BoardSubscriptionId, T>,
    ): FacadeOutput<T> {
        return pipe(output, TE.mapLeft(repositoryErrorToSubscriptionError));
    }
}
