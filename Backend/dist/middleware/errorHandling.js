export const errorHandler = (error, req, res, next) => {
    let errorMsg = error.message || 'An unexpected error occurred';
    if (errorMsg.includes("E11000") || errorMsg.includes("duplicate key error")) {
        console.error(error);
        return res.status(409).send("Credentials already exist");
    }
    console.log(errorMsg);
    res.status(400).send(errorMsg);
};
