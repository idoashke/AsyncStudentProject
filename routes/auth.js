import {Router} from 'express';
import expressBasicAuth from "express-basic-auth";
import {validate_user} from "../common/validators.js";

const router = Router();
router.use(expressBasicAuth({
    authorizer: async (username, password, cb) => {
        await validate_user(username, password, cb)
    },
    authorizeAsync: true,
}))

router.get("", async (req, res, next) => {
        res.json(true);
});

export default router;
