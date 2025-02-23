import * as TE from "fp-ts/TaskEither";
import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/function";
import { FacadeOutput } from "../../common/facade/FacadeOutput";
import { CommentFacade } from "../facade/CommentFacade";
import { CommentRepository } from "../repository/CommentRepository";
import * as C from "../types/Comment";
import * as P from "../../post/types/Post";
import * as CE from "../types/CommentError";
import * as RE from "../../common/repository/RepositoryError";
import { FacadeError } from "../../common/facade/FacadeError";
import { UserFacade } from "../../user/facade/UserFacade";
import { PostFacade } from "../../post/facade/PostFacade";
import { RepositoryOutput } from "../../common/repository/RepositoryOutput";

const repositoryErrorToCommentError = (
    repositoryError: RE.RepositoryError<C.CommentId>,
): FacadeError<C.CommentId> => {
    if (RE.isBadRequestError(repositoryError, C.commentId.type)) {
        return CE.commentBadRequestError(
            repositoryError.ids,
            repositoryError.message,
        );
    }
    if (RE.isRepositoryNotFoundError(repositoryError, C.commentId.type)) {
        return CE.commentNotFoundError(repositoryError.ids, O.none);
    }
    return CE.commentInternalError(
        repositoryError.ids,
        O.some(repositoryError.message),
    );
};

const parentDoesNotBelongToPostError = (id: C.CommentId) =>
    CE.commentBadRequestError([id], "Parent comment does not belong to post.");

export class CommentDomain implements CommentFacade {
    constructor(
        private repository: CommentRepository,
        private userFacade: UserFacade,
        private postFacade: PostFacade,
    ) {}

    // TODO validate that postId and parentId are compatible
    create(input: C.CreateCommentInput): FacadeOutput<C.Comment> {
        return pipe(
            TE.Do,
            TE.bind("user", () =>
                this.userFacade.getFromContext(input.context),
            ),
            TE.bind("post", () => this.postFacade.get({ id: input.postId })),
            TE.bind("parentOpt", () =>
                this.getParentComment(input.parentId, input.postId),
            ),
            TE.map(({ user, post, parentOpt }) => {
                const timestamp = new Date();
                return {
                    id: C.generateCommentId(),
                    authorId: user.id,
                    postId: post.id,
                    parentId: O.map<C.Comment, C.CommentId>(
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
            TE.chain((comment) =>
                this.callRepository(this.repository.save(comment)),
            ),
        );
    }

    private getParentComment(id: O.Option<C.CommentId>, postId: P.PostId) {
        return O.fold<C.CommentId, FacadeOutput<O.Option<C.Comment>>>(
            () => TE.right(O.none),
            (parentId) =>
                pipe(
                    this.callRepository(this.repository.find(parentId)),
                    TE.chain((parent) =>
                        parent.postId === postId
                            ? TE.right(O.some(parent))
                            : TE.left(parentDoesNotBelongToPostError(parentId)),
                    ),
                ),
        )(id);
    }

    listByPost(input: C.ListCommentsByPost): FacadeOutput<C.Comment[]> {
        return this.callRepository(
            this.repository.listByPostId(input.postId, {
                first: input.first,
                cursor: input.cursor,
            }),
        );
    }

    listByUser(input: C.ListCommentsByUser): FacadeOutput<C.Comment[]> {
        return this.callRepository(
            this.repository.listByUserId(input.userId, {
                first: input.first,
                cursor: input.cursor,
            }),
        );
    }

    // TODO allow moderators to delete comments
    delete(input: C.DeleteCommentInput): FacadeOutput<void> {
        return pipe(
            TE.Do,
            TE.bind("user", () =>
                this.userFacade.getFromContext(input.context),
            ),
            TE.bind("comment", () =>
                this.callRepository(this.repository.find(input.id)),
            ),
            TE.chain(({ user, comment }) =>
                comment.authorId === user.id
                    ? this.callRepository(this.repository.delete(comment.id))
                    : TE.left(CE.commentForbiddenError([comment.id], O.none)),
            ),
        );
    }

    private callRepository<T>(output: RepositoryOutput<C.CommentId, T>) {
        return pipe(output, TE.mapLeft(repositoryErrorToCommentError));
    }
}
