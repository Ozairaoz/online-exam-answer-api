function errorHandler(err, req, res, next) {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).json({
            error: "Request body must be valid JSON"
        });
    }

    console.error(err);
    return res.status(500).json({
        error: "Database request failed"
    });
}

module.exports = errorHandler;
