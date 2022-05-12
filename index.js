var express = require("express"),
    bodyParser = require("body-parser"),
    swaggerJsdoc = require("swagger-jsdoc"),
    swaggerUi = require("swagger-ui-express");
var app = express();

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "expenses tracker api",
        },
    },
    apis: ["./routes/expense.js"],
};

const specs = swaggerJsdoc(options);
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs)
);


app.listen(3000, () => {
    console.log("Server running on port 3000");
});

app.get("/test", (req, res, next) => {
    res.json(["Tony", "Lisa", "Michael", "Ginger", "Food"]);
});
