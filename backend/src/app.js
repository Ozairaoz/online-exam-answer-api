const express = require("express");
const examRoutes = require("./routes/examRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Online Exam Answer API is running"
    });
});

app.use("/exam", examRoutes);

app.use(errorHandler);

module.exports = app;
