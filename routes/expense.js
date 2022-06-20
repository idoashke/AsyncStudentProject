import {Router} from 'express';
import {createRequire} from "module";
import {addNewExpenseByUserId} from "../public/db_adapter.js";
import {NoExpensesForUser, PermissionDenied} from "../public/errors.js";

const require = createRequire(import.meta.url);

import {v4 as uuidv4} from 'uuid';
import expressBasicAuth from "express-basic-auth";
import {checkForPermission, validateUser} from "../public/validators.js";

const bodySchema = require('body-schema');

const expenseSchema = {
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
        await validateUser(username, password, cb)
    },
    authorizeAsync: true,
}))

async function ProvideExpenseContext(reqBodyParams) {
    return {
        "id": uuidv4().toString(),
        "cost": reqBodyParams.cost,
        "description": reqBodyParams.description,
        "category": reqBodyParams.category,
        "date": new Date(Date.now())
    }
}

router.post("/:user_id", bodySchema(expenseSchema), async (req, res, next) => {
    try {
        await checkForPermission(req.auth["user"], req.params.user_id)
        let expenseContext = await ProvideExpenseContext(req.body)
        await addNewExpenseByUserId(req.params.user_id, expenseContext)
        res.json(expenseContext.id);

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
