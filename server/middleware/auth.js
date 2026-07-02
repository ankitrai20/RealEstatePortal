const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {

    const authHeader = req.header("Authorization");

    console.log("HEADER:", authHeader);
    console.log("SECRET:", process.env.JWT_SECRET);

    if (!authHeader) {
        return res.status(401).json({
            message: "Access Denied"
        });
    }

    const token = authHeader.replace("Bearer ", "");

    console.log("TOKEN:", token);

    try {

        const verified = jwt.verify(token, process.env.JWT_SECRET);

        console.log("VERIFIED:", verified);

        req.user = verified;

        next();

    } catch (err) {

        console.log(err);

        return res.status(400).json({
            message: "Invalid Token"
        });

    }

};

module.exports = auth;