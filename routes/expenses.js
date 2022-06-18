import {Router} from 'express';
import {getAllExpensesByUserId} from "../public/db_adapter.js";
import {NoExpensesForUser, PermissionDenied} from "../public/errors.js";
import expressBasicAuth from "express-basic-auth";
import {validateUser, checkForPermission} from "../public/validators.js";

const router = Router();
router.use(expressBasicAuth({
    authorizer: async (username, password, cb) => {
        await validateUser(username, password, cb)
    },
    authorizeAsync: true,
}))

router.get("/:user_id", async (req, res, next) => {
        try {
            await checkForPermission(req.auth["user"], req.params.user_id)
            let expenses = await getAllExpensesByUserId(req.params.user_id)
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
