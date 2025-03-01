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

export type CursorValue = {
    columnName: string;
    resolve: (cursor: string) => string;
};

export abstract class RelationalPaginatedRepository<
        ID,
        CURSOR,
        T,
        ENTITY extends object,
    >
    extends RelationalRepository<ID, T, ENTITY>
    implements PaginatedRepository<ID, CURSOR, T>
{
    constructor(
        protected idType: t.Type<ID>,
        protected getId: (entity: T) => ID,
        protected idColumnName: string,
        protected cursorValues: NEA.NonEmptyArray<CursorValue>,
        protected orm: MikroORM,
        protected entityName: EntityName<ENTITY>,
    ) {
        super(idType, getId, idColumnName, orm, entityName);
    }

    list(options: PaginationOptions<CURSOR>): RepositoryOutput<ID, T[]> {
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

    protected getFiltersFromCursor(cursor: CURSOR) {
        return this.cursorValues.reduce(
            (acc, cursorValue) => ({
                ...acc,

                [cursorValue.columnName]: {
                    $gt: cursorValue.resolve(cursor as string),
                },
            }),
            {},
        );
    }
}
