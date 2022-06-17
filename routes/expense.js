import {Router} from 'express';
import {createRequire} from "module";
import {add_new_expense_by_user_id} from "../common/db_adapter.js";
import {NoExpensesForUser, PermissionDenied} from "../common/errors.js";

const require = createRequire(import.meta.url);

import {v4 as uuidv4} from 'uuid';
import expressBasicAuth from "express-basic-auth";
import {check_for_permission, validate_user} from "../common/validators.js";

const bodySchema = require('body-schema');

var expense_schema = {
    'type': 'object',
    'properties': {
        'cost': {
            'type': 'number'
        },
        'description': {
            'type': 'string'
        },
        'category': {
            'type': 'string'
        }

    },
    'required': ['cost', 'description', 'category']
};
const router = Router();
router.use(expressBasicAuth({
    authorizer: async (username, password, cb) => {
        await validate_user(username, password, cb)
    },
    authorizeAsync: true,
}))

async function create_expense_context(req_body_params) {
    return {
        "id": uuidv4().toString(),
        "cost": req_body_params.cost,
        "description": req_body_params.description,
        "category": req_body_params.category,
        "date": new Date(Date.now())
    }
}

router.post("/:user_id", bodySchema(expense_schema), async (req, res, next) => {
    try {
        await check_for_permission(req.auth["user"], req.params.user_id)
        let expense_context = await create_expense_context(req.body)
        await add_new_expense_by_user_id(req.params.user_id, expense_context)
        res.json(expense_context.id);

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

});

export default router;
