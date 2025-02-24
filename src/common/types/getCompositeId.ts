import * as td from "io-ts-types";
import { createHash } from "crypto";

export const getCompositeId = (userId: td.UUID, boardId: td.UUID): td.UUID => {
    const hash = createHash("sha256");
    hash.update(userId);
    hash.update(boardId);
    const uuid = hash.digest("hex").slice(0, 32);
    return [
        uuid.slice(0, 8),
        uuid.slice(8, 12),
        uuid.slice(12, 16),
        uuid.slice(16, 20),
        uuid.slice(20, 32),
    ].join("-") as td.UUID;
};
