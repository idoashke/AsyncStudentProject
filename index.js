import express from 'express';
import {createRequire} from "module";
import swaggerUi from 'swagger-ui-express';
import expenses from "./routes/expenses.js";
import expense from "./routes/expense.js";

const require = createRequire(import.meta.url);

const swaggerDocument = require('./swagger.json')


const app = express();


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json())


app.listen(3000, () => {
    console.log("Server running on port 3000");
});
// routes
app.use('/expenses', expenses)
app.use('/expense', expense)
