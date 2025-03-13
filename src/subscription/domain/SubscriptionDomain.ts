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
import * as SUE from "../event/SubscriptionUpdatedEvent";
import { SubscriptionUpdatedEventRepository } from "../event/repository/SubscriptionUpdatedEventRepository";
import { OutboxHandler } from "../../common/outbox/OutboxHandler";

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
    private outboxHandler: OutboxHandler<
        S.BoardSubscriptionId,
        SUE.SubscriptionUpdatedEventBody,
        SUE.SubscriptionUpdatedEvent
    >;

    constructor(
        private repository: SubscriptionRepository,
        private subscriptionUpdateEventRepository: SubscriptionUpdatedEventRepository,
        private eventBus: EventBus<
            SUE.SubscriptionUpdatedEventBody,
            SUE.SubscriptionUpdatedEvent
        >,
        private userFacade: UserFacade,
    ) {
        this.outboxHandler = new OutboxHandler<
            S.BoardSubscriptionId,
            SUE.SubscriptionUpdatedEventBody,
            SUE.SubscriptionUpdatedEvent
        >(
            this.subscriptionUpdateEventRepository,
            (event) =>
                S.getBoardSubscriptionId(event.body.userId, event.body.boardId),
            repositoryErrorToSubscriptionError,
        );
        this.outboxHandler.startHandler(this.eventBus.dispatch);
    }

    subscribe(
        input: SI.SubscribeToBoardInput,
    ): FacadeOutput<S.BoardSubscription> {
        return pipe(
            TE.Do,
            TE.chain(() => this.userFacade.getFromContext(input.context)),
            // TODO handle if already exists - idempotent? but 'created' should not be overwritten
            TE.chain(() =>
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
        );
    }

    listSubscriptionsByBoard(
        input: SI.ListSubscriptionsByBoardInput,
    ): FacadeOutput<S.BoardSubscription[]> {
        return pipe(
            TE.Do,
            TE.chain(() =>
                this.callRepository(
                    this.repository.listSubscriptionsByBoard(input.id, {
                        first: input.first,
                        cursor: input.cursor,
                    }),
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
                    this.repository.listSubscriptionsByUser(input.id, {
                        first: input.first,
                        cursor: input.cursor,
                    }),
                ),
            ),
        );
    }

    unsubscribe(input: SI.UnsubscribeFromBoardInput): FacadeOutput<void> {
        return pipe(
            TE.Do,
            TE.chain(() => this.userFacade.getFromContext(input.context)),
            TE.chain(() => this.callRepository(this.repository.find(input.id))),
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

    private callRepository<T>(
        output: RepositoryOutput<S.BoardSubscriptionId, T>,
    ): FacadeOutput<T> {
        return pipe(output, TE.mapLeft(repositoryErrorToSubscriptionError));
    }
}
