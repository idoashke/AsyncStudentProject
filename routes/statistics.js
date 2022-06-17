import {Router} from 'express';
import {NoExpensesBetweenDates, NoExpensesWithCurrentCategory, PermissionDenied} from "../common/errors.js";
import {get_expenses_statistic_by_dates, get_expenses_statistic_by_category} from "../common/db_adapter.js";
import expressBasicAuth from "express-basic-auth";
import {check_for_permission, validate_user} from "../common/validators.js";

const router = Router();

router.use(expressBasicAuth({
    authorizer: async (username, password, cb) => {
        await validate_user(username, password, cb)
    },
    authorizeAsync: true,
}))


router.get("/:user_id/year/:year", async (req, res, next) => {
    try {
        await check_for_permission(req.auth["user"], req.params.user_id)
        let end_year = parseInt(req.params.year) + 1
        let start_date = new Date(req.params.year, 0, 1)
        let end_date = new Date(end_year, 0, 1)
        let expenses = await get_expenses_statistic_by_dates(req.params.user_id, start_date, end_date)
        res.json(expenses);
    } catch (e) {
        if (e instanceof NoExpensesBetweenDates) {
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

});


router.get("/:user_id/year/:year/month/:month", async (req, res, next) => {
    try {
        await check_for_permission(req.auth["user"], req.params.user_id)
        let month = parseInt(req.params.month) - 1
        let end_month = parseInt(req.params.month)
        let end_year = parseInt(req.params.year)
        if (month === 11) {
            end_month = 0
            end_year = end_year + 1
        }
        let start_date = new Date(req.params.year, month, 1)
        let end_date = new Date(end_year, end_month, 1)
        let expenses = await get_expenses_statistic_by_dates(req.params.user_id, start_date, end_date)
        res.json(expenses);
    } catch (e) {
        if (e instanceof NoExpensesBetweenDates) {
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

});

router.get("/:user_id/category/:category", async (req, res, next) => {
    try {
        await check_for_permission(req.auth["user"], req.params.user_id)
        let expenses = await get_expenses_statistic_by_category(req.params.user_id, req.params.category)
        res.json(expenses);
    } catch (e) {
        if (e instanceof NoExpensesWithCurrentCategory) {
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

});


export default router;
