const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt')
const { User, LoginHistory } = require('../config/db')
const VerifyToken = require('../middleware/VerifyToken')

router.use(bodyParser.json());

router.get('/login-history', async (req, res) => {
    try {
        const loginHistory = await LoginHistory.findAll({
            raw: true,
            order: [['loginTime', 'DESC']]
        });
        return res.status(200).send({ message: 'Login history fetched successfully', loginHistory });
    } catch (error) {
        console.error("Error fetching login history:", error);
        return res.status(500).send({ message: 'Internal server error' });
    }
});

router.get('/', VerifyToken, async (req, res) => {
    try {
        let obj = {};
        if (req.user.role !== 'admin') obj.role = 'user';
        let userFind = await User.findAll({ raw: true, where: obj, attributes: { exclude: ['password', 'createdAt', 'updatedAt'] } })
        return res.status(200).send(userFind)
    } catch (error) {
        return res.status(500).send('There was a problem to find users')
    }
})

router.post('/', async (req, res) => {
    try {
        console.log("res.user", req.user)
        const find_user = await User.findOne({ raw: true, where: { email: req.body.email } });
        if (find_user) return res.status(500).send('Email already present');
        req.body.password = await bcrypt.hash(req.body.password, 8)
        const createdUser = await User.create(req.body);
        return res.status(201).send({ message: 'user created successfully', createdUser });
    } catch (error) {
        return res.status(500).send('Error creating the user');
    }
});

router.delete('/:id', VerifyToken, async (req, res) => {
    try {
        await User.destroy({ where: { id: req.params.id } })
        return res.status(200).send("User deleted Successfully")
    } catch (error) {
        return res.status(500).send('Error in delete the user');
    }
})

module.exports = router