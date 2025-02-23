import * as TE from "fp-ts/TaskEither";
import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/function";
import { FacadeOutput } from "../../common/contract/FacadeOutput";
import * as P from "../contract/Post";
import * as PE from "../contract/PostError";
import { PostFacade } from "../contract/PostFacade";
import { PostRepository } from "../repository/PostRepository";
import { UserFacade } from "../../user/contract/UserFacade";
import { BoardFacade } from "../../board/contract/BoardFacade";
import * as RE from "../../common/repository/RepositoryError";
import { RepositoryOutput } from "../../common/repository/RepositoryOutput";

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
    ) {}

    create(input: P.CreatePostInput): FacadeOutput<P.Post> {
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

    // TODO cannot remove vote, also if changing vote, both upvotes and downvotes should be updated
    vote(input: P.VoteInput): FacadeOutput<void> {
        return pipe(
            TE.Do,
            TE.bind("user", () =>
                this.userFacade.getFromContext(input.context),
            ),
            TE.bind("post", () =>
                this.callRepository(this.repository.find(input.id)),
            ),
            TE.chain(({ user, post }) =>
                this.callRepository(
                    this.repository.vote(post.id, user.id, input.type),
                ),
            ),
        );
    }

    listByBoard(input: P.ListPostsByBoardInput): FacadeOutput<P.Post[]> {
        return this.callRepository(
            this.repository.findByBoardId(input.boardId, {
                first: input.first,
                cursor: input.cursor,
            }),
        );
    }

    listByUser(input: P.ListPostsByUserInput): FacadeOutput<P.Post[]> {
        return this.callRepository(
            this.repository.findByUserId(input.userId, {
                first: input.first,
                cursor: input.cursor,
            }),
        );
    }

    // TODO allow moderators to delete posts
    delete(input: P.DeletePostInput): FacadeOutput<void> {
        return pipe(
            TE.Do,
            TE.bind("user", () =>
                this.userFacade.getFromContext(input.context),
            ),
            TE.bind("post", () =>
                this.callRepository(this.repository.find(input.id)),
            ),
            TE.chain(({ user, post }) =>
                post.authorId === user.id
                    ? this.callRepository(this.repository.delete(post.id))
                    : TE.left(PE.postForbiddenError([post.id], O.none)),
            ),
        );
    }

    private callRepository<T>(
        output: RepositoryOutput<P.PostId, T>,
    ): FacadeOutput<T> {
        return pipe(output, TE.mapLeft(repositoryErrorToPostError));
    }
}
