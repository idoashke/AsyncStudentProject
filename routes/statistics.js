import {Router} from 'express';
import {NoExpensesBetweenDates, NoExpensesWithCurrentCategory} from "../common/errors.js";
import {get_expenses_statistic_by_dates, get_expenses_statistic_by_category} from "../common/db_adapter.js";

const router = Router();

router.get("/:user_id/year/:year", async (req, res, next) => {
    try {
        let end_year = parseInt(req.params.year) + 1
        let start_date = new Date(req.params.year, 0, 1)
        let end_date = new Date(end_year, 0, 1)
        let expenses = await get_expenses_statistic_by_dates(req.params.user_id, start_date, end_date)
        res.json(expenses);
    } catch (e) {
        if (e instanceof NoExpensesBetweenDates) {
            res.status(404)
            next(e)
        } else {
            res.status(500)
            next(e)
        }
    }

});


router.get("/:user_id/year/:year/month/:month", async (req, res, next) => {
    try {
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
        } else {
            res.status(500)
            next(e)
        }
    }

});

router.get("/:user_id/category/:category", async (req, res, next) => {
    try {
        let expenses = await get_expenses_statistic_by_category(req.params.user_id, req.params.category)
        res.json(expenses);
    } catch (e) {
        if (e instanceof NoExpensesWithCurrentCategory) {
            res.status(404)
            next(e)
        } else {
            res.status(500)
            next(e)
        }
    }

});


export default router;
