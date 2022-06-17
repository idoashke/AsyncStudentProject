import {Router} from 'express';
import {get_all_expenses_by_user_id} from "../public/db_adapter.js";
import {NoExpensesForUser, PermissionDenied} from "../public/errors.js";
import expressBasicAuth from "express-basic-auth";
import {validate_user, check_for_permission} from "../public/validators.js";

const router = Router();
router.use(expressBasicAuth({
    authorizer: async (username, password, cb) => {
        await validate_user(username, password, cb)
    },
    authorizeAsync: true,
}))

router.get("/:user_id", async (req, res, next) => {
        try {
            await check_for_permission(req.auth["user"], req.params.user_id)
            let expenses = await get_all_expenses_by_user_id(req.params.user_id)
            res.json(expenses);
        } catch (e) {
            if (e instanceof NoExpensesForUser) {
                res.status(404)
                next(e)
            } else if (e instanceof PermissionDenied) {
                res.status(403)
                next(e)
            } else {
                res.status(500)
                next(e)
            }
        }

    }
)
;
export default router;
