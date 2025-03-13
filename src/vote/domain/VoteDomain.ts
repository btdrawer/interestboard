import * as TE from "fp-ts/TaskEither";
import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/function";
import { FacadeOutput } from "../../common/facade/FacadeOutput";
import { VoteFacade } from "../facade/VoteFacade";
import { VoteRepository } from "../repository/VoteRepository";
import * as V from "../types/Vote";
import * as VI from "../types/VoteInput";
import * as VE from "../types/VoteError";
import * as RE from "../../common/repository/RepositoryError";
import {
    Action,
    VoteEvent,
    VoteEventBody,
    voteEvent,
} from "../event/VoteEvent";
import { UserFacade } from "../../user/facade/UserFacade";
import { EventBus } from "../../common/event/EventBus";
import { RepositoryOutput } from "../../common/repository/RepositoryOutput";
import { OutboxHandler } from "../../common/outbox/OutboxHandler";
import { VoteEventRepository } from "../event/repository/VoteEventRepository";

export const repositoryErrorToVoteError = (
    repositoryError: RE.RepositoryError<V.VoteId>,
): VE.VoteError => {
    if (RE.isRepositoryNotFoundError(repositoryError, V.voteId.type)) {
        return VE.voteNotFoundError(repositoryError.ids, O.none);
    }
    return VE.voteInternalError(repositoryError.ids, O.none);
};

export class VoteDomain implements VoteFacade {
    private outboxHandler: OutboxHandler<V.VoteId, VoteEventBody, VoteEvent>;

    constructor(
        private repository: VoteRepository,
        private voteEventRepository: VoteEventRepository,
        private eventBus: EventBus<VoteEventBody, VoteEvent>,
        private userFacade: UserFacade,
    ) {
        this.outboxHandler = new OutboxHandler<
            V.VoteId,
            VoteEventBody,
            VoteEvent
        >(
            this.voteEventRepository,
            (event) =>
                V.generateVoteRecordId(event.body.userId, event.body.threadId),
            repositoryErrorToVoteError,
        );
        this.outboxHandler.startHandler(this.eventBus.dispatch);
    }

    // TODO can vote on non-existent IDs
    vote(input: VI.VoteInput): FacadeOutput<V.Vote> {
        return pipe(
            TE.Do,
            TE.chain(() => this.userFacade.getFromContext(input.context)),
            TE.map((user) => {
                const id = V.generateVoteRecordId(user.id, input.threadId);
                const date = new Date();
                return {
                    id,
                    userId: user.id,
                    threadId: input.threadId,
                    parentId: input.parentId,
                    type: input.type,
                    created: date,
                    updated: date,
                };
            }),
            TE.chain((vote) => this.callRepository(this.repository.save(vote))),
        );
    }

    listUserVotesByThread(
        input: VI.ListUserVotesByThreadInput,
    ): FacadeOutput<V.Vote[]> {
        return pipe(
            TE.Do,
            TE.chain(() => this.userFacade.getFromContext(input.context)),
            TE.chain((user) =>
                this.callRepository(
                    this.repository.listVotesByUserIdAndThreadId(
                        user.id,
                        input.threadId,
                    ),
                ),
            ),
        );
    }

    unvote(input: VI.UnvoteInput): FacadeOutput<void> {
        return pipe(
            TE.Do,
            TE.bind("user", () =>
                this.userFacade.getFromContext(input.context),
            ),
            TE.bind("id", ({ user }) =>
                TE.right(V.generateVoteRecordId(user.id, input.threadId)),
            ),
            TE.bind("vote", ({ id }) =>
                this.callRepository(this.repository.find(id)),
            ),
            TE.chain(({ id }) =>
                this.callRepository(this.repository.delete(id)),
            ),
        );
    }

    private callRepository<T>(output: RepositoryOutput<V.VoteId, T>) {
        return pipe(output, TE.mapLeft(repositoryErrorToVoteError));
    }
}
