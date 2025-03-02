import * as t from "io-ts";
import * as TE from "fp-ts/TaskEither";
import * as O from "fp-ts/Option";
import * as NEA from "fp-ts/NonEmptyArray";
import { pipe } from "fp-ts/function";
import { RepositoryOutput } from "../../RepositoryOutput";
import { MikroORM, EntityName } from "@mikro-orm/core";
import {
    PaginatedRepository,
    PaginationOptions,
} from "../../PaginatedRepository";
import { RelationalRepository } from "./RelationalRepository";
import { decodeCursor } from "../../Repository";

export abstract class RelationalPaginatedRepository<
        ID,
        T,
        ENTITY extends object,
    >
    extends RelationalRepository<ID, T, ENTITY>
    implements PaginatedRepository<ID, T>
{
    constructor(
        protected idType: t.Type<ID>,
        protected getId: (entity: T) => ID,
        protected idColumnName: string,
        protected cursorColumnNames: NEA.NonEmptyArray<string>,
        protected orm: MikroORM,
        protected entityName: EntityName<ENTITY>,
    ) {
        super(idType, getId, idColumnName, orm, entityName);
    }

    list(options: PaginationOptions): RepositoryOutput<ID, T[]> {
        const filters = O.getOrElse(() => ({}))(
            O.map(this.getFiltersFromCursor)(options.cursor),
        );
        return pipe(
            this.callOrm([], () =>
                this.entityRepository.find(filters, { limit: options.first }),
            ),
            TE.map((entities) => entities.map(this.fromEntity)),
        );
    }

    protected getFiltersFromCursor(cursor: string) {
        return pipe(
            decodeCursor(cursor),
            O.map((decodedCursor) =>
                this.cursorColumnNames.reduce((acc, columnName, i) => {
                    const columnValue = decodedCursor[i];
                    return {
                        ...acc,
                        [columnName]: {
                            $gt: columnValue,
                        },
                    };
                }, {}),
            ),
        );
    }
}
