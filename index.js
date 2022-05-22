import express from 'express';
import {createRequire} from "module";
import swaggerUi from 'swagger-ui-express';
import expenses from "./routes/expenses.js";
import expense from "./routes/expense.js";
import statistics from "./routes/statistics.js";
import expressBasicAuth from "express-basic-auth";
import {authorize} from "./common/auth.js";
import user from "./routes/User.js";

const require = createRequire(import.meta.url);

const swaggerDocument = require('./swagger.json')


const app = express();


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json())
app.use(expressBasicAuth({
    authorizer: (username, password, cb) => {
        const userMatches = expressBasicAuth.safeCompare(username, 'demo')
        const passwordMatches = expressBasicAuth.safeCompare(password, 'Password1')
        if (userMatches & passwordMatches)
            return cb(null, true)
        else
            return cb(null, false)
    },
    authorizeAsync: true,
}))


app.listen(3000, () => {
    console.log("Server running on port 3000");
});
// routes
app.use('/expenses/user', expenses)
app.use('/expense/user', expense)
app.use('/expenses-statistics/user', statistics)
app.use('/user', user)
