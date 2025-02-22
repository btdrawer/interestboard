import * as TE from "fp-ts/TaskEither";
import { RepositoryError } from "./RepositoryError";

export type RepositoryOutput<ID, T> = TE.TaskEither<RepositoryError<ID>, T>;
