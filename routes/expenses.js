import {Router} from 'express';
import {get_all_expenses_by_user_id} from "../common/db_adapter.js";
import {NoExpensesForUser} from "../common/errors.js";
import expressBasicAuth from "express-basic-auth";
import {validate_user} from "../common/validators.js";
import router from "./statistics.js";


router.use(expressBasicAuth({
    authorizer: async (username, password, cb) => {
        await validate_user(username, password, cb)
    },
    authorizeAsync: true,
}))


router.get("/:user_id", async (req, res, next) => {
    try {
        let expenses = await get_all_expenses_by_user_id(req.params.user_id)
        res.json(expenses);
    } catch (e) {
        if (e instanceof NoExpensesForUser) {
            res.status(404)
            next(e)
        } else {
            res.status(500)
            next(e)
        }
    }

});

export default router;
