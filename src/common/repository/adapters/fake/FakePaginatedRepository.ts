import * as TE from "fp-ts/TaskEither";
import {
    PaginatedRepository,
    PaginationOptions,
} from "../../PaginatedRepository";
import * as RE from "../../RepositoryError";
import { FakeRepository } from "./FakeRepository";

export class FakePaginatedRepository<ID, CURSOR, T>
    extends FakeRepository<ID, T>
    implements PaginatedRepository<ID, CURSOR, T>
{
    list(
        options: PaginationOptions<CURSOR>,
    ): TE.TaskEither<RE.RepositoryError<ID>, T[]> {
        throw new Error("Method not implemented.");
    }
}
