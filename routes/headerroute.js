import {Router} from 'express';

const router = Router();

router.get("", async (req, res) => {
        console.log("some user connected");
});

export default router;
