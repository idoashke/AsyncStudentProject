import {Router} from 'express';
import {get_all_expenses_by_user_id} from "../common/db_adapter.js";
import {NoExpensesForUser} from "../common/errors.js";

const router = Router();

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
