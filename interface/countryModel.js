import mongoose from "mongoose";

const countrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  iso3: {
    type: String,
    required: true,
  },
  iso2: {
    type: String,
    required: true,
  },
  numeric_code: {
    type: String,
    required: true,
  },
  phone_code: {
    type: String,
    required: true,
  },
  capital: {
    type: String,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  currency_name: {
    type: String,
    required: true,
  },
  currency_symbol: {
    type: String,
    required: true,
  },
  tld: {
    type: String,
    required: true,
  },
  native: {
    type: String,
    required: true,
  },
  region: {
    type: String,
    required: true,
  },
  region_id: {
    type: String,
    required: true,
  },
  subregion: {
    type: String,
    required: true,
  },
  subregion_id: {
    type: String,
    required: true,
  },
  nationality: {
    type: String,
    required: true,
  },
  emoji: {
    type: String,
    required: true,
  },
  timezones: {
    type: Array,
    required: true,
  },

});

export const countryModel = mongoose.model("countries", countrySchema);
