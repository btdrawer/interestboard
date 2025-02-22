import * as TE from "fp-ts/TaskEither";
import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/function";
import * as U from "../../user/contract/User";
import * as B from "../contract/Board";
import * as BE from "../contract/BoardError";
import { BoardFacade } from "../contract/BoardFacade";
import { UserFacade } from "../../user/contract/UserFacade";
import { BoardRepository } from "../repository/BoardRepository";
import { FacadeOutput } from "../../common/contract/FacadeOutput";
import {
    isRepositoryNotFoundError,
    RepositoryError,
} from "../../common/repository/RepositoryError";
import { NonEmptyArray } from "fp-ts/lib/NonEmptyArray";

export const repositoryErrorToBoardError = (
    repositoryError: RepositoryError<B.BoardId>,
): BE.BoardError => {
    if (isRepositoryNotFoundError(repositoryError, B.boardId.type)) {
        return BE.boardNotFoundError(repositoryError.ids, O.none);
    }
    return BE.boardInternalError(repositoryError.ids, O.none);
};

const notAModeratorError = (id: B.BoardId) =>
    BE.boardForbiddenError(
        [id],
        "You cannot update this board because you are not a moderator.",
    );

const noModeratorsLeftError = (id: B.BoardId) =>
    BE.boardBadRequestError(
        [id],
        "You cannot remove the last moderator from a board.",
    );

export class BoardDomain implements BoardFacade {
    constructor(
        private repository: BoardRepository,
        private userFacade: UserFacade,
    ) {}

    create(input: B.CreateBoardInput): FacadeOutput<B.Board> {
        return pipe(
            TE.Do,
            TE.chain(() => this.userFacade.getFromContext(input.context)),
            TE.map((user) => {
                const timestamp = new Date();
                return {
                    id: B.generateBoardId(),
                    name: input.name,
                    title: input.title,
                    description: input.description,
                    moderators: [user.id] as NonEmptyArray<U.UserId>,
                    subscribers: 1,
                    locked: false,
                    created: timestamp,
                    updated: timestamp,
                };
            }),
            TE.chain((board) =>
                this.callRepository(this.repository.save(board)),
            ),
        );
    }

    update(input: B.UpdateBoardInput): FacadeOutput<B.Board> {
        return pipe(
            TE.Do,
            TE.chain(() => this.userFacade.getFromContext(input.context)),
            TE.chain(() => this.callRepository(this.repository.find(input.id))),
            TE.chain((board) => this.validateUpdate(input, board)),
            TE.map((board) => ({
                ...board,
                name: input.name,
                title: input.title,
                description: input.description,
                moderators: [
                    ...board.moderators.filter(
                        (m) => !input.moderators.remove.includes(m),
                    ),
                    ...input.moderators.add,
                ] as NonEmptyArray<U.UserId>, // TODO better validation
                locked: input.locked,
                updated: new Date(),
            })),
            TE.chain((updatedBoard) =>
                this.callRepository(this.repository.save(updatedBoard)),
            ),
        );
    }

    private validateUpdate(
        input: B.UpdateBoardInput,
        board: B.Board,
    ): FacadeOutput<B.Board> {
        return pipe(
            TE.Do,
            TE.chain(() => {
                if (!board.moderators.includes(input.context.userId)) {
                    return TE.left(notAModeratorError(input.id));
                }
                return TE.right(board);
            }),
            TE.chain(() =>
                this.userFacade.getByIds([
                    // validate all moderators exist
                    ...input.moderators.add,
                    ...input.moderators.remove,
                ]),
            ),
            TE.chain(() => {
                if (
                    input.moderators.remove.length === board.moderators.length
                ) {
                    return TE.left(noModeratorsLeftError(input.id));
                }
                return TE.right(board);
            }),
        );
    }

    subscribe(input: B.SubscribeToBoardInput): FacadeOutput<void> {
        return pipe(
            TE.Do,
            TE.chain(() => this.userFacade.getFromContext(input.context)),
            TE.chain(() => this.callRepository(this.repository.find(input.id))),
            TE.chain(() =>
                this.callRepository(
                    this.repository.subscribe(input.id, input.context.userId),
                ),
            ),
        );
    }

    unsubscribe(input: B.UnsubscribeFromBoardInput): FacadeOutput<void> {
        return pipe(
            TE.Do,
            TE.chain(() => this.userFacade.getFromContext(input.context)),
            TE.chain(() => this.callRepository(this.repository.find(input.id))),
            TE.chain(() =>
                this.callRepository(
                    this.repository.unsubscribe(input.id, input.context.userId),
                ),
            ),
        );
    }

    private callRepository<T>(
        operation: TE.TaskEither<RepositoryError<B.BoardId>, T>,
    ) {
        return pipe(operation, TE.mapLeft(repositoryErrorToBoardError));
    }
}
