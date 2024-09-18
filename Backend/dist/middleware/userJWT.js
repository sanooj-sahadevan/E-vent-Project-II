import jwt from "jsonwebtoken";
export function verifyUser(req, res, next) {
    const Token = req.cookies?.token;
    if (!Token) {
        return res.status(401).json("JWT not found in the cookies");
    }
    const secret = process.env.JWT_SECRET || "";
    if (!secret) {
        return res.status(500).json("JWT secret not found in the env");
    }
    try {
        const decoded = jwt.verify(Token, secret);
        // req.userId = decoded?.userId;
        next();
    }
    catch (err) {
        console.log(err);
        return res.status(401).send("Invalid JWT");
    }
}
