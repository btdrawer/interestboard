import { paginatedRepositoryTest } from "../../common/repository/PaginatedRepository.abstract.spec";
import { repositoryTest } from "../../common/repository/Repository.abstract.spec";
import { boardEntityFactory } from "./BoardEntityFactory.util.spec";
import * as BR from "./BoardRepository";

export const boardRepositoryTest = (repositoryF: () => BR.BoardRepository) => {
    repositoryTest(repositoryF, boardEntityFactory);
    paginatedRepositoryTest(repositoryF, boardEntityFactory);
};
