import { paginatedRepositoryTest } from "../../common/repository/PaginatedRepository.abstract.spec";
import { repositoryTest } from "../../common/repository/Repository.abstract.spec";
import { threadEntityFactory } from "./ThreadEntityFactory.util.spec";
import * as TR from "./ThreadRepository";

export const threadRepositoryTest = (
    repositoryF: () => TR.ThreadRepository,
) => {
    repositoryTest(repositoryF, threadEntityFactory);
    paginatedRepositoryTest(repositoryF, threadEntityFactory);
};
