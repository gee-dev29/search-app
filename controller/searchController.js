import lunr from "lunr";
import { churchModel } from "../models/churchModel.js";
import { branchesModel } from "../models/churchBranchesModel.js";
import { ApprovalStatus } from "../enums/approvalStatus.js";
import { redisClient } from "../connection/redisConnection.js";

let index = null;
let indexedData = {};

const REDIS_INDEX_KEY = "lunr:index";
const REDIS_DATA_KEY = "lunr:data";

// Build Lunr Index and Cache to Redis
const buildSearchIndex = async () => {
    const filter = { approvalStatus: ApprovalStatus.APPROVED };
    const churches = await churchModel.find(filter);
    const branches = await branchesModel.find(filter);

    indexedData = {};

    index = lunr(function () {
        this.ref("id");
        this.field("combined");

        churches.forEach((church) => {
            const combined = [
                church.nameOfChurch,
                church.generalOverseer,
                church.denomination,
                church.yearOfEstablishment,
            ].filter(Boolean).join(" ").toLowerCase();

            const doc = {
                id: `church-${church._id}`,
                combined,
            };

            indexedData[doc.id] = church;
            this.add(doc);
        });

        branches.forEach((branch) => {
            const combined = [
                branch.branchName,
                branch.city,
                branch.state,
                branch.country,
                branch.street,
                branch.nameOfBranchPastor,
            ].filter(Boolean).join(" ").toLowerCase();

            const doc = {
                id: `branch-${branch._id}`,
                combined,
            };

            indexedData[doc.id] = branch;
            this.add(doc);
        });
    });

    // Cache to Redis
    await redisClient.set(REDIS_INDEX_KEY, JSON.stringify(index.toJSON()));
    await redisClient.set(REDIS_DATA_KEY, JSON.stringify(indexedData));

    console.log("✅ Lunr index and data cached in Redis.");
};

// Search Function
const searchDatabase = async (query) => {
    // Try to load from Redis first
    if (!index || Object.keys(indexedData).length === 0) {
        const [indexJson, dataJson] = await Promise.all([
            redisClient.get(REDIS_INDEX_KEY),
            redisClient.get(REDIS_DATA_KEY),
        ]);

        if (indexJson && dataJson) {
            index = lunr.Index.load(JSON.parse(indexJson));
            indexedData = JSON.parse(dataJson);
            console.log("📦 Loaded Lunr index from Redis.");
        } else {
            await buildSearchIndex();
        }
    }

    const cleanQuery = query.trim().toLowerCase();
    console.log("🔍 Searching for:", cleanQuery);

    // Try exact match first
    let results = index.search(`"${cleanQuery}"`);

    if (results.length === 0 && cleanQuery.length > 2) {
        const fuzzyQuery = cleanQuery
            .split(" ")
            .map((word) => `${word}~1`)
            .join(" ");
        console.log("🔁 No exact matches. Trying fuzzy:", fuzzyQuery);
        results = index.search(fuzzyQuery);
    }

    const uniqueRefs = new Set();
    const finalResults = results
        .filter((res) => !uniqueRefs.has(res.ref) && uniqueRefs.add(res.ref))
        .map((res) => indexedData[res.ref]);

    console.log("✅ Found", finalResults.length, "results.");
    return finalResults;
};

export { searchDatabase };
