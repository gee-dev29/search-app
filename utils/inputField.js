const registerField = ["fullName", "phone", "email", "password"];
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
    "postalCode",
    "postalCode",
    
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
