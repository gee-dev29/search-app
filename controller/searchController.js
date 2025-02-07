import lunr from "lunr";
import { churchModel } from "../models/churchModel.js";
import { branchesModel } from "../models/churchBranchesModel.js";


let index = null;
let indexedData = {}; // Store original documents for retrieving results

// **Function to Extract Population from Query**
const extractPopulation = (query) => {
    // Improved regex: allows optional words and spacing variations
    const match = query.match(/population\s*(greater|less|more|above|below|under|over|equal|equals|=)?\s*(than|to)?\s*(\d+)/i);
    
    if (match) {
        console.log("Regex Match Found:", match);

        let condition = match[1] ? match[1].toLowerCase() : "equal"; // Default to "equal" if no condition found
        let value = parseInt(match[3], 10); // Ensure it's a number

        console.log(`Extracted condition: ${condition}, value: ${value}`);

        // Normalize conditions
        if (["greater", "more", "above", "over"].includes(condition)) {
            condition = "greater";
        } else if (["less", "below", "under"].includes(condition)) {
            condition = "less";
        } else {
            condition = "equal";
        }

        return { condition, value };
    }
    return null;
};




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
        this.field("population");

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
            const population = branch.branchPopulation; 
            const doc = {
                id: `branch-${branch._id}`,
                branchName: branch.branchName,
                city: branch.city,
                state: branch.state,
                country: branch.country,
                pastor: branch.nameOfBranchPastor,
                population: population, // Store as number
                type: "branch",
            };
            indexedData[doc.id] = branch;
            this.add(doc);
        });
    });

    console.log("Lunr Index with Fuzzy Search and Dynamic Population Filtering Built Successfully");
};

// **Enhanced Search Function with Dynamic Population Filtering**
const searchDatabase = async (query) => {
    console.log("Raw Query Received:", query);

    if (!index) {
        await buildSearchIndex();
    }

    // Extract population filter from query
    const populationFilter = extractPopulation(query);

    // Perform fuzzy search using Lunr.js
    const fuzzyQuery = query
        .replace(/\b(greater|less|more|above|below|under|over|equal|than|equals|=)\b \d+/gi, "") // Remove population filter from text search
        .split(" ")
        .map((word) => `${word}~1`) // Add fuzzy search (~1 edit distance)
        .join(" ");


    const lunrResults = index.search(fuzzyQuery);
    const lunrIds = lunrResults.map(res => res.ref.replace('branch-', '')); // Extract MongoDB IDs

    // Build Mongoose query
    let mongoQuery = { _id: { $in: lunrIds } };

    // **Apply population filtering in MongoDB**
    if (populationFilter) {
        const { condition, value } = populationFilter;
        if (condition === "greater") {
            mongoQuery.branchPopulation = { $gt: value };
        } else if (condition === "less") {
            mongoQuery.branchPopulation = { $lt: value };
        } else {
            mongoQuery.branchPopulation = value;
        }
    }

    // **Query MongoDB with optimized filtering**
    const results = await branchesModel.find(mongoQuery);
    return results;
};



export { searchDatabase };