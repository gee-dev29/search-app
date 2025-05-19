// searchService.js
import lunr from "lunr";
import { churchModel } from "../models/churchModel.js";
import { branchesModel } from "../models/churchBranchesModel.js";
import { ApprovalStatus } from "../enums/approvalStatus.js";

let index = null;
let indexedData = {};

const buildSearchIndex = async () => {
  const filter = { approvalStatus: ApprovalStatus.APPROVED };

  const churches = await churchModel.find(filter).lean();
  const branches = await branchesModel.find(filter).lean();

  indexedData = {}; // Clear old data

  index = lunr(function () {
    this.ref("id");
    this.field("type");
    this.field("combined");

    // Index churches
    churches.forEach((church) => {
      const combined = [
        church.nameOfChurch,
        church.generalOverseer,
        church.denomination,
        church.yearOfEstablishment?.toString(),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const doc = {
        id: `church-${church._id}`,
        type: "church",
        combined,
      };

      indexedData[doc.id] = { ...church, _type: "church" };
      this.add(doc);
    });

    // Index branches
    branches.forEach((branch) => {
      const combined = [
        branch.branchName,
        branch.city,
        branch.state,
        branch.country,
        branch.continent,
        branch.street,
        branch.nameOfBranchPastor,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const doc = {
        id: `branch-${branch._id}`,
        type: "branch",
        combined,
      };

      indexedData[doc.id] = { ...branch, _type: "branch" };
      this.add(doc);
    });
  });

  console.log("✅ Lunr index built with", Object.keys(indexedData).length, "documents.");
};

const searchDatabase = async (query) => {
  if (!index) {
    await buildSearchIndex();
  }

  const cleanQuery = query.trim().toLowerCase();
  console.log("🔍 Searching for:", cleanQuery);

  let results = [];

  // Try exact phrase match first
  try {
    results = index.search(`"${cleanQuery}"`);
  } catch (err) {
    console.warn("Exact match failed:", err.message);
  }

  // Fallback to fuzzy if no results
  if (results.length === 0 && cleanQuery.length > 2) {
    const fuzzyQuery = cleanQuery
      .split(" ")
      .filter(Boolean)
      .map((word) => `${word}~1`)
      .join(" ");
    try {
      console.log("🔁 Trying fuzzy search:", fuzzyQuery);
      results = index.search(fuzzyQuery);
    } catch (err) {
      console.warn("Fuzzy search failed:", err.message);
    }
  }

  const finalResults = [];
  const seen = new Set();

  for (const result of results) {
    if (!seen.has(result.ref)) {
      seen.add(result.ref);
      const item = indexedData[result.ref];
      if (item) {
        finalResults.push(item);
      }
    }
  }

  console.log("✅ Found", finalResults.length, "results.");
  return finalResults;
};

export { buildSearchIndex, searchDatabase };
