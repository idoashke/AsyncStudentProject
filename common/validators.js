import {is_user_exists} from "./db_adapter.js";
import {UserAlreadyExist} from "./errors.js";
import {get_user_by_username} from "./db_adapter.js";
import expressBasicAuth from "express-basic-auth";


async function get_user_creds(username) {
    if(await is_user_exists(username) === false){
        return false
    }
    const user_creds = await get_user_by_username(username)
    return [username, user_creds["password"]]
}
async function validate_user(username,password, cb){
    const creds = await get_user_creds(username)
    if (creds === false)
        return cb(null, false)
    const userMatches = expressBasicAuth.safeCompare(username, creds[0])
    const passwordMatches = expressBasicAuth.safeCompare(password, creds[1])
    if (userMatches && passwordMatches)
        return cb(null, true)
    else
        return cb(null, false)
}

async function check_if_user_exists(user_id) {
    if (await is_user_exists(user_id) === true) throw new UserAlreadyExist()

}

export {get_user_creds, check_if_user_exists,validate_user}