import express from 'express';
import {createRequire} from "module";
import swaggerUi from 'swagger-ui-express';
import expenses from "./routes/expenses.js";

const require = createRequire(import.meta.url);

const swaggerDocument = require('./swagger.json')


const app = express();


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.listen(3000, () => {
    console.log("Server running on port 3000");
});
// routes
app.use('/expenses', expenses)
