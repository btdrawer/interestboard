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

export const repositoryErrorToSubscriptionError = (
    repositoryError: RE.RepositoryError<V.VoteId>,
): VE.VoteError => {
    if (RE.isRepositoryNotFoundError(repositoryError, V.voteId.type)) {
        return VE.voteNotFoundError(repositoryError.ids, O.none);
    }
    return VE.voteInternalError(repositoryError.ids, O.none);
};

export class VoteDomain implements VoteFacade {
    constructor(
        private repository: VoteRepository,
        private voteEventBus: EventBus<VoteEventBody, VoteEvent>,
        private userFacade: UserFacade,
    ) {}

    // TODO can vote on non-existent IDs
    vote(input: VI.VoteInput): FacadeOutput<V.Vote> {
        return pipe(
            TE.Do,
            TE.chain(() => this.userFacade.getFromContext(input.context)),
            TE.map((user) => {
                const id = V.generateVoteRecordId(
                    user.id,
                    input.record.type,
                    input.record.id,
                );
                return {
                    id,
                    userId: user.id,
                    record: input.record,
                    type: input.type,
                };
            }),
            TE.chain((vote) => this.callRepository(this.repository.save(vote))),
            TE.map((vote) => {
                this.voteEventBus.dispatch(
                    voteEvent(
                        {
                            userId: vote.userId,
                            record: vote.record,
                            type: vote.type,
                            action: Action.Vote,
                        },
                        new Date(),
                    ),
                );
                return vote;
            }),
        );
    }

    listUserVotesByPost(
        input: VI.ListUserVotesByPostInput,
    ): FacadeOutput<V.Vote[]> {
        return pipe(
            TE.Do,
            TE.chain(() => this.userFacade.getFromContext(input.context)),
            TE.chain((user) =>
                this.callRepository(
                    this.repository.listVotesByUserIdAndPostId(
                        user.id,
                        input.postId,
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
                TE.right(
                    V.generateVoteRecordId(
                        user.id,
                        input.record.type,
                        input.record.id,
                    ),
                ),
            ),
            TE.bind("vote", ({ id }) =>
                this.callRepository(this.repository.find(id)),
            ),
            TE.bind("deleteVote", ({ id }) =>
                this.callRepository(this.repository.delete(id)),
            ),
            TE.map(({ vote }) => {
                this.voteEventBus.dispatch(
                    voteEvent(
                        {
                            userId: input.context.userId,
                            record: input.record,
                            type: vote.type,
                            action: Action.Unvote,
                        },
                        new Date(),
                    ),
                );
                return undefined;
            }),
        );
    }

    private callRepository<T>(output: RepositoryOutput<V.VoteId, T>) {
        return pipe(output, TE.mapLeft(repositoryErrorToSubscriptionError));
    }
}
