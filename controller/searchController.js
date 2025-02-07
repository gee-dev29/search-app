import lunr from "lunr";
import { churchModel } from "../models/churchModel.js";
import { branchesModel } from "../models/churchBranchesModel.js";
let index = null;
let indexedData = {}; // Store original documents for retrieving results

// **Function to Build Lunr Index**
const buildSearchIndex = async () => {
    const churches = await churchModel.find();
    const branches = await branchesModel.find();

    index = lunr(function () {
        this.ref("id");
        this.field("name");
        this.field("overseer");
        this.field("denomination");
        this.field("year");
        this.field("branchName");
        this.field("city");
        this.field("state");
        this.field("country");
        this.field("pastor");

        churches.forEach((church) => {
            const doc = {
                id: `church-${church._id}`,
                name: church.nameOfChurch,
                overseer: church.generalOverseer,
                denomination: church.denomination,
                year: church.yearOfEstablishment?.toString(),
                type: "church",
            };
            indexedData[doc.id] = church;
            this.add(doc);
        });

        branches.forEach((branch) => {
            const doc = {
                id: `branch-${branch._id}`,
                branchName: branch.branchName,
                city: branch.city,
                state: branch.state,
                country: branch.country,
                pastor: branch.nameOfBranchPastor,
                type: "branch",
            };
            indexedData[doc.id] = branch;
            this.add(doc);
        });
    });

};

// **Enhanced Fuzzy Search Function**
const searchDatabase = async (query) => {
    if (!index) {
        await buildSearchIndex();
    }

    // Apply fuzzy search (~1 allows for 1 character difference, ~2 allows for 2 character differences)
    const fuzzyQuery = query
        .split(" ")
        .map((word) => `${word}~1`) // Apply fuzzy matching (~1 edit distance)
        .join(" ");

    const results = index.search(fuzzyQuery);
    return results.map((res) => indexedData[res.ref]);
};

export { searchDatabase };