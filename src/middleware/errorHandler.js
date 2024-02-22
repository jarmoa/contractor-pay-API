
class AppError {
    constructor(code, message) {
        this.code = code;
        this.message = message;
    }
}

const errorHandler = (err, req, res, next) => {
    if(err instanceof AppError) {
        res.status(err.code).json(err.message);
        return;
    }
    console.log("An error occurred: ", err);
    res.status(500).json("An error occurred, please try again later.");
    next();
};


module.exports = {errorHandler, AppError}