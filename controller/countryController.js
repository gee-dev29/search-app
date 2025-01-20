import { countryModel } from "../interface/countryModel.js";
import { getAllFilteredData } from "../utils/entity.js";

export const getAllCountries = async (req, res) => {
  try {
    const data = await getAllFilteredData(countryModel);
    res.status(200).json({
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
