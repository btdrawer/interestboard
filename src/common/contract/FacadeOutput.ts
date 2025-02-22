import * as TE from "fp-ts/TaskEither";
import * as FE from "./FacadeError";

export type FacadeOutput<O> = TE.TaskEither<FE.FacadeError<any>, O>;
