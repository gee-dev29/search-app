const registerField = ["fullName", "phone", "email", "password", "role"];
const updateField = ["phone", "address", "profilePicture"];
const adminRegisterField = [
    "fullName",
    "email",
    "password",
    "street",
    "city",
    "state",
    "country",
    "postalCode"
];
const dataEntryField = [
    "nameOfChurch",
    "nameOfGO",
    "denomination",
    "yearOfEstablishment",
    "churchURL",
    "socialMediaPage",
    "continent",
    "country",
    "state",
    "city",
    "street",
];
const loginField = ["email", "password"];
const verifyOTPField = ["otp", "email"];

export {
    registerField,
    updateField,
    adminRegisterField,
    loginField,
    verifyOTPField,
    dataEntryField
};
