const express = require("express");
const cors = require("cors");
const examRoutes = require("./routes/examRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

const corsOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
    : true;

app.use(cors({ origin: corsOrigins }));
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Online Exam Answer API is running"
    });
});

app.use("/exam", examRoutes);

app.use(errorHandler);

module.exports = app;
