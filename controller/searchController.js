// import lunr from "lunr";
// import { churchModel } from "../models/churchModel.js";
// import { branchesModel } from "../models/churchBranchesModel.js";
// import { ApprovalStatus } from "../enums/approvalStatus.js";
// let index = null;
// let indexedData = {}; // Store original documents for retrieving results

// // **Function to Build Lunr Index**
// const buildSearchIndex = async () => {
//     const filter = {
//         approvalStatus: ApprovalStatus.APPROVED
//     }
//     const churches = await churchModel.find(filter);
//     const branches = await branchesModel.find(filter);

//     index = lunr(function () {
//         this.ref("id");
//         this.field("name");
//         this.field("overseer");
//         this.field("denomination");
//         this.field("year");
//         this.field("branchName");
//         this.field("city");
//         this.field("state");
//         this.field("street");
//         this.field("country");
//         this.field("pastor");

//         churches.forEach((church) => {
//             const doc = {
//                 id: `church-${church._id}`,
//                 name: church.nameOfChurch,
//                 overseer: church.generalOverseer,
//                 denomination: church.denomination,
//                 year: church.yearOfEstablishment?.toString(),
//                 type: "church",
//             };
//             indexedData[doc.id] = church;
//             this.add(doc);
//         });

//         branches.forEach((branch) => {
//             const doc = {
//                 id: `branch-${branch._id}`,
//                 branchName: branch.branchName,
//                 city: branch.city,
//                 state: branch.state,
//                 country: branch.country,
//                 street: branch.street,
//                 pastor: branch.nameOfBranchPastor,
//                 type: "branch",
//             };
//             indexedData[doc.id] = branch;
//             this.add(doc);
//         });
//     });

// };

// // **Enhanced Fuzzy Search Function**
// const searchDatabase = async (query) => {
//     if (!index) {
//         await buildSearchIndex();
//     }

//     const words = query.trim().split(" ");
//     const fuzzyQuery = words
//         .map(word => (word.length <= 3 ? `${word}~1` : `${word}~1`)) // Adjust ~1 or ~2 based on length if needed
//         .join(" ");

//     const results = index.search(fuzzyQuery);

//     const minScore = 0.05;
//     const filteredResults = results.filter(result => result.score >= minScore);

//     return filteredResults.map(res => indexedData[res.ref]);
// };

// export { searchDatabase };

// import lunr from "lunr";
// import { churchModel } from "../models/churchModel.js";
// import { branchesModel } from "../models/churchBranchesModel.js";
// import { ApprovalStatus } from "../enums/approvalStatus.js";

// let index = null;
// let indexedData = {};

// // Build Lunr Index
// const buildSearchIndex = async () => {
//     const filter = { approvalStatus: ApprovalStatus.APPROVED };

//     const churches = await churchModel.find(filter);
//     const branches = await branchesModel.find(filter);

//     index = lunr(function () {
//         this.ref("id");
//         this.field("combined");

//         // Index churches
//         churches.forEach((church) => {
//             const combined = [
//                 church.nameOfChurch,
//                 church.generalOverseer,
//                 church.denomination,
//                 church.yearOfEstablishment,
//             ]
//                 .filter(Boolean)
//                 .join(" ")
//                 .toLowerCase();

//             const doc = {
//                 id: `church-${church._id}`,
//                 combined,
//             };

//             indexedData[doc.id] = church;
//             this.add(doc);
//         });

//         // Index branches
//         branches.forEach((branch) => {
//             const combined = [
//                 branch.branchName,
//                 branch.city,
//                 branch.state,
//                 branch.country,
//                 branch.street,
//                 branch.nameOfBranchPastor,
//             ]
//                 .filter(Boolean)
//                 .join(" ")
//                 .toLowerCase();

//             const doc = {
//                 id: `branch-${branch._id}`,
//                 combined,
//             };

//             indexedData[doc.id] = branch;
//             this.add(doc);
//         });
//     });

//     console.log("✅ Lunr index built with", Object.keys(indexedData).length, "documents.");
// };

// // Search Function
// const searchDatabase = async (query) => {
//     if (!index) {
//         await buildSearchIndex();
//     }

//     const cleanQuery = query.trim().toLowerCase();
//     console.log("🔍 Searching for:", cleanQuery);

//     // Try exact phrase match
//     let results = index.search(`"${cleanQuery}"`);

//     // Fallback to fuzzy if no results
//     if (results.length === 0 && cleanQuery.length > 2) {
//         const fuzzyQuery = cleanQuery
//             .split(" ")
//             .filter(Boolean)
//             .map((word) => `${word}~1`)
//             .join(" ");
//         console.log("🔁 No exact matches. Trying fuzzy:", fuzzyQuery);
//         results = index.search(fuzzyQuery);
//     }

//     // Return results
//     const uniqueRefs = new Set();
//     const finalResults = results
//         .filter(res => !uniqueRefs.has(res.ref) && uniqueRefs.add(res.ref))
//         .map(res => indexedData[res.ref]);

//     console.log("✅ Found", finalResults.length, "results.");
//     return finalResults;
// };

// export { searchDatabase}

import lunr from "lunr";
import { churchModel } from "../models/churchModel.js";
import { branchesModel } from "../models/churchBranchesModel.js";
import { ApprovalStatus } from "../enums/approvalStatus.js";
let index = null;
let indexedData = {}; // Store original documents for retrieving results

// **Function to Build Lunr Index**
const buildSearchIndex = async () => {
    const filter = {
        approvalStatus: ApprovalStatus.APPROVED
    }
    const churches = await churchModel.find(filter);
    const branches = await branchesModel.find(filter);

    index = lunr(function () {
        this.ref("id");
        this.field("name");
        this.field("overseer");
        this.field("denomination");
        this.field("year");
        this.field("branchName");
        this.field("city");
        this.field("state");
        this.field("street");
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
                street: branch.street,
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