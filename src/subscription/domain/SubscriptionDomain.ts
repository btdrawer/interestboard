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
import * as RE from "../../common/repository/RepositoryError";
import { RepositoryOutput } from "../../common/repository/RepositoryOutput";
import { EventBus } from "../../common/event/EventBus";
import {
    subscriptionUpdatedEvent,
    SubscriptionUpdatedEvent,
    SubscriptionUpdatedEventBody,
} from "../event/SubscriptionUpdatedEvent";

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
        private eventBus: EventBus<
            SubscriptionUpdatedEventBody,
            SubscriptionUpdatedEvent
        >,
        private userFacade: UserFacade,
    ) {}

    listSubscriptionsByBoard(
        input: SI.ListSubscriptionsByBoardInput,
    ): FacadeOutput<S.BoardSubscription[]> {
        return pipe(
            TE.Do,
            TE.chain(() =>
                this.callRepository(
                    this.repository.listSubscriptionsByBoard(input.id),
                ),
            ),
            // TODO return not found if no subscriptions
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

    // TODO how do we check board exists? Can we trust it does if other subscriptions

    // TODO check other subscriptions exist for board
    subscribe(
        input: SI.SubscribeToBoardInput,
    ): FacadeOutput<S.BoardSubscription> {
        return pipe(
            TE.Do,
            TE.chain(() => this.userFacade.getFromContext(input.context)),
            TE.chain(() => this.callRepository(this.repository.find(input.id))),
            TE.bind("subscription", () =>
                this.callRepository(
                    this.repository.save({
                        id: S.getBoardSubscriptionId(
                            input.context.userId,
                            input.id,
                        ),
                        userId: input.context.userId,
                        boardId: input.id,
                        type: S.BoardSubscriptionType.Member,
                        created: new Date(),
                    }),
                ),
            ),
            TE.map(({ subscription }) => {
                this.eventBus.dispatch(
                    subscriptionUpdatedEvent(
                        {
                            userId: subscription.userId,
                            boardId: subscription.boardId,
                            type: subscription.type,
                        },
                        new Date(),
                    ),
                );
                return subscription;
            }),
        );
    }

    // TODO do not allow if no other subscriptions left for board
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
            TE.map(() => undefined),
        );
    }

    updateSubscriptionType(
        input: SI.UpdateSubscriptionType,
    ): FacadeOutput<S.BoardSubscription> {
        throw new Error("Method not implemented.");
    }

    private callRepository<T>(
        output: RepositoryOutput<S.BoardSubscriptionId, T>,
    ): FacadeOutput<T> {
        return pipe(output, TE.mapLeft(repositoryErrorToSubscriptionError));
    }
}
