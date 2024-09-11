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
const loginField = ["email", "password"];
const verifyOTPField = ["otp", "email"];

export {
    registerField,
    updateField,
    adminRegisterField,
    loginField,
    verifyOTPField,
};
