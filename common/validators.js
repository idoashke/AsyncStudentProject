import {is_user_exists} from "./db_adapter.js";
import {UserAlreadyExist} from "./errors.js";


async function authorize(username, password) {

}

async function check_if_user_exists(user_id) {
    if (await is_user_exists(user_id) === true) throw new UserAlreadyExist()

}

export {authorize, check_if_user_exists}