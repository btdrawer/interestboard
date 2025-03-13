import * as TE from "fp-ts/TaskEither";
import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/function";
import { FacadeOutput } from "../../common/facade/FacadeOutput";
import { ThreadFacade } from "../facade/ThreadFacade";
import { ThreadRepository } from "../repository/ThreadRepository";
import * as T from "../types/Thread";
import * as TI from "../types/ThreadInput";
import * as B from "../../board/types/Board";
import * as U from "../../user/types/User";
import * as CE from "../types/ThreadError";
import * as RE from "../../common/repository/RepositoryError";
import { FacadeError } from "../../common/facade/FacadeError";
import { UserFacade } from "../../user/facade/UserFacade";
import { RepositoryOutput } from "../../common/repository/RepositoryOutput";
import { EventBus } from "../../common/event/EventBus";
import { Action, VoteEvent, VoteEventBody } from "../../vote/event/VoteEvent";
import { VoteType } from "../../vote/types/Vote";
import { BoardFacade } from "../../board/facade/BoardFacade";

const repositoryErrorToThreadError = (
    repositoryError: RE.RepositoryError<T.ThreadId>,
): FacadeError<T.ThreadId> => {
    if (RE.isBadRequestError(repositoryError, T.threadId.type)) {
        return CE.threadBadRequestError(
            repositoryError.ids,
            repositoryError.message,
        );
    }
    if (RE.isRepositoryNotFoundError(repositoryError, T.threadId.type)) {
        return CE.threadNotFoundError(repositoryError.ids, O.none);
    }
    return CE.threadInternalError(
        repositoryError.ids,
        O.some(repositoryError.message),
    );
};

const parentDoesNotBelongToBoardError = (id: T.ThreadId) =>
    CE.threadBadRequestError(
        [id],
        "Parent thread does not belong to the same board.",
    );

export class ThreadDomain implements ThreadFacade {
    constructor(
        private repository: ThreadRepository,
        private userFacade: UserFacade,
        private boardFacade: BoardFacade,
        private voteEventBus: EventBus<VoteEventBody, VoteEvent>,
    ) {
        this.voteEventBus.addListener(this.updateVotes);
    }

    private updateVotes(event: VoteEvent) {
        return pipe(
            TE.Do,
            TE.chain(() =>
                this.callRepository(this.repository.find(event.body.threadId)),
            ),
            TE.chain((thread) => {
                const type = event.body.type;
                const action = event.body.action;
                const updated = {
                    ...thread,
                    upvotes:
                        type === VoteType.Up
                            ? this.modifyVotes(thread.upvotes, action)
                            : thread.upvotes,
                    downvotes:
                        type === VoteType.Down
                            ? this.modifyVotes(thread.downvotes, action)
                            : thread.downvotes,
                    updated: new Date(),
                };
                return this.callRepository(this.repository.save(updated));
            }),
            TE.map(() => undefined),
        );
    }

    private modifyVotes(votes: number, action: Action) {
        return action === Action.Vote ? votes + 1 : votes - 1;
    }

    create(input: TI.CreateThreadInput): FacadeOutput<T.Thread> {
        return pipe(
            TE.Do,
            TE.bind("user", () =>
                this.userFacade.getFromContext(input.context),
            ),
            TE.bind("parentOpt", () =>
                this.getParentThread(input.parentId, input.boardId),
            ),
            TE.map(({ user, parentOpt }) => {
                const timestamp = new Date();
                return {
                    id: T.generateThreadId(),
                    authorId: user.id,
                    boardId: input.boardId,
                    parentId: O.map<T.Thread, T.ThreadId>(
                        (parent) => parent.id,
                    )(parentOpt),
                    body: input.body,
                    upvotes: 0,
                    downvotes: 0,
                    created: timestamp,
                    updated: timestamp,
                    deleted: O.none,
                };
            }),
            TE.chain((thread) =>
                this.callRepository(this.repository.save(thread)),
            ),
        );
    }

    private getParentThread(id: O.Option<T.ThreadId>, boardId: B.BoardId) {
        return O.fold<T.ThreadId, FacadeOutput<O.Option<T.Thread>>>(
            () => TE.right(O.none),
            (parentId) =>
                pipe(
                    this.callRepository(this.repository.find(parentId)),
                    TE.chain((parent) =>
                        parent.boardId === boardId
                            ? TE.right(O.some(parent))
                            : TE.left(
                                  parentDoesNotBelongToBoardError(parentId),
                              ),
                    ),
                ),
        )(id);
    }

    listByParent(input: TI.ListThreadsByParent): FacadeOutput<T.Thread[]> {
        return this.callRepository(
            this.repository.listByParentId(input.parentId, {
                first: input.first,
                cursor: input.cursor,
            }),
        );
    }

    listByUser(input: TI.ListThreadsByUser): FacadeOutput<T.Thread[]> {
        return this.callRepository(
            this.repository.listByUserId(input.userId, {
                first: input.first,
                cursor: input.cursor,
            }),
        );
    }

    delete(input: TI.DeleteThreadInput): FacadeOutput<void> {
        return pipe(
            TE.Do,
            TE.bind("user", () =>
                this.userFacade.getFromContext(input.context),
            ),
            TE.bind("thread", () =>
                this.callRepository(this.repository.find(input.id)),
            ),
            TE.bind("board", ({ thread }) =>
                this.boardFacade.get(thread.boardId),
            ),
            TE.chain(({ user, thread, board }) =>
                this.canDeleteThread(user.id, thread.authorId, board.moderators)
                    ? this.callRepository(this.repository.delete(thread.id))
                    : TE.left(CE.threadForbiddenError([thread.id], O.none)),
            ),
        );
    }

    private canDeleteThread(
        callerId: U.UserId,
        authorId: U.UserId,
        moderators: U.UserId[],
    ) {
        return callerId === authorId || moderators.includes(callerId);
    }

    private callRepository<T>(output: RepositoryOutput<T.ThreadId, T>) {
        return pipe(output, TE.mapLeft(repositoryErrorToThreadError));
    }
}
