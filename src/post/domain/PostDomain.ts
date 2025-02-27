import * as TE from "fp-ts/TaskEither";
import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/function";
import { FacadeOutput } from "../../common/facade/FacadeOutput";
import * as P from "../types/Post";
import * as PI from "../types/PostInput";
import * as PE from "../types/PostError";
import * as U from "../../user/types/User";
import { PostFacade } from "../facade/PostFacade";
import { PostRepository } from "../repository/PostRepository";
import { UserFacade } from "../../user/facade/UserFacade";
import { BoardFacade } from "../../board/facade/BoardFacade";
import * as RE from "../../common/repository/RepositoryError";
import { RepositoryOutput } from "../../common/repository/RepositoryOutput";
import { EventBus } from "../../common/event/EventBus";
import { Action, VoteEvent, VoteEventBody } from "../../vote/event/VoteEvent";
import { VoteRecordType, VoteType } from "../../vote/types/Vote";

const repositoryErrorToPostError = (
    repositoryError: RE.RepositoryError<P.PostId>,
) => {
    if (RE.isRepositoryNotFoundError(repositoryError, P.postId.type)) {
        return PE.postNotFoundError(repositoryError.ids, O.none);
    }
    return PE.postInternalError(repositoryError.ids, O.none);
};

export class PostDomain implements PostFacade {
    constructor(
        private repository: PostRepository,
        private userFacade: UserFacade,
        private boardFacade: BoardFacade,
        private voteEventBus: EventBus<VoteEventBody, VoteEvent>,
    ) {
        this.voteEventBus.addListener((event) => {
            if (event.body.record.type === VoteRecordType.Post) {
                this.updateVotes(event)();
            }
        });
    }

    private updateVotes(event: VoteEvent) {
        return pipe(
            TE.Do,
            TE.chain(() =>
                this.callRepository(this.repository.find(event.body.record.id)),
            ),
            TE.chain((post) => {
                const type = event.body.type;
                const action = event.body.action;
                const updated = {
                    ...post,
                    upvotes:
                        type === VoteType.Up
                            ? this.modifyVotes(post.upvotes, action)
                            : post.upvotes,
                    downvotes:
                        type === VoteType.Down
                            ? this.modifyVotes(post.downvotes, action)
                            : post.downvotes,
                    updated: new Date(),
                };
                return this.callRepository(this.repository.save(updated));
            }),
        );
    }

    private modifyVotes(votes: number, action: Action) {
        return action === Action.Vote ? votes + 1 : votes - 1;
    }

    create(input: PI.CreatePostInput): FacadeOutput<P.Post> {
        return pipe(
            TE.Do,
            TE.bind("user", () =>
                this.userFacade.getFromContext(input.context),
            ),
            TE.bind("board", () => this.boardFacade.get(input.boardId)),
            TE.map(({ user, board }) => {
                const timestamp = new Date();
                return {
                    id: P.generatePostId(),
                    authorId: user.id,
                    boardId: board.id,
                    title: input.title,
                    body: input.body,
                    upvotes: 0,
                    downvotes: 0,
                    userVote: O.none,
                    comments: 0,
                    created: timestamp,
                    updated: timestamp,
                    deleted: O.none,
                };
            }),
            TE.chain((post) => this.callRepository(this.repository.save(post))),
        );
    }

    get(input: PI.GetPostInput): FacadeOutput<P.Post> {
        return this.callRepository(this.repository.find(input.id));
    }

    listByBoard(input: PI.ListPostsByBoardInput): FacadeOutput<P.Post[]> {
        return this.callRepository(
            this.repository.findByBoardId(input.boardId, {
                first: input.first,
                cursor: input.cursor,
            }),
        );
    }

    listByUser(input: PI.ListPostsByUserInput): FacadeOutput<P.Post[]> {
        return this.callRepository(
            this.repository.findByUserId(input.userId, {
                first: input.first,
                cursor: input.cursor,
            }),
        );
    }

    delete(input: PI.DeletePostInput): FacadeOutput<void> {
        return pipe(
            TE.Do,
            TE.bind("user", () =>
                this.userFacade.getFromContext(input.context),
            ),
            TE.bind("post", () =>
                this.callRepository(this.repository.find(input.id)),
            ),
            TE.bind("board", ({ post }) => this.boardFacade.get(post.boardId)),
            TE.chain(({ user, post, board }) =>
                this.canDeleteComment(user.id, post.authorId, board.moderators)
                    ? this.callRepository(this.repository.delete(post.id))
                    : TE.left(PE.postForbiddenError([post.id], O.none)),
            ),
        );
    }

    private canDeleteComment(
        callerId: U.UserId,
        authorId: U.UserId,
        moderators: U.UserId[],
    ) {
        return callerId === authorId || moderators.includes(callerId);
    }

    private callRepository<T>(
        output: RepositoryOutput<P.PostId, T>,
    ): FacadeOutput<T> {
        return pipe(output, TE.mapLeft(repositoryErrorToPostError));
    }
}
