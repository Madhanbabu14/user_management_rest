const jwt = require('jsonwebtoken');
const { User } = require('../config/db');

const VerifyToken = async (req, res, next) => {
    const token = req.headers['x-access-token'];

    if (!token) {
        return res.status(403).send({ auth: false, message: 'No Token provided' });
    }

    jwt.verify(token, '@#12@123#', async (err, decoded) => {
        if (err) {
            console.log("err", err)
            return res.status(401).send({ auth: false, message: 'Failed to authenticate token' });
        }

        try {
            const obj = { username: decoded.username };
            console.log("obj", obj)

            const userFind = await User.findOne({ raw: true, where: obj });

            if (!userFind) {
                return res.status(404).send({ auth: false, message: 'User not found' });
            }

            if (userFind.somePermissionCheck) {
                return res.status(403).send({ auth: false, message: 'No permission to access' });
            }

            req.user = {
                username: userFind.username,
                email: userFind.email,
                role: userFind.role
            };

            next();
        } catch (error) {
            console.error(error);
            return res.status(500).send({ auth: false, message: 'Internal server error' }); // Stop execution here
        }
    });
};

module.exports = VerifyToken;
