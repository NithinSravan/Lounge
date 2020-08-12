const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken=jwt.verify(token, 'mybestkeptsecret');
        req.userData={
          username:decodedToken.username,
          userId:decodedToken._id
        };
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' })
    }
}

module.exports = auth
