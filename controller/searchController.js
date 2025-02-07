import lunr from "lunr";
import { churchModel } from "../models/churchModel.js";
import { branchesModel } from "../models/churchBranchesModel.js";

let index = null;

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
            this.add({
                id: church._id.toString(),
                name: church.nameOfChurch,
                overseer: church.generalOverseer,
                denomination: church.denomination,
                year: church.yearOfEstablishment.toString(),
            });
        });

        branches.forEach((branch) => {
            this.add({
                id: branch._id.toString(),
                branchName: branch.branchName,
                city: branch.city,
                state: branch.state,
                country: branch.country,
                pastor: branch.nameOfBranchPastor,
            });
        });
    });

    console.log("Lunr Index Built");
};

// **Search Function**
const searchDatabase = async (query) => {
    if (!index) {
        await buildSearchIndex();
    }
    
    const results = index.search(query);
    const ids = results.map((res) => res.ref);

    const churches = await churchModel.find({ _id: { $in: ids } });
    const branches = await branchesModel.find({ _id: { $in: ids } });

    return [...churches, ...branches];
};

export { searchDatabase };
