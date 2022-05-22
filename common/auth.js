import expressBasicAuth from "express-basic-auth";

async function authorize(username, password) {
    // const userMatches = await expressBasicAuth.safeCompare(username, "demo")
    // const passwordMatches = await expressBasicAuth.safeCompare(password, "password1")
    // return userMatches & passwordMatches;
    return false
}

export {authorize}