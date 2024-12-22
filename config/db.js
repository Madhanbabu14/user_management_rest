const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('intdb1', 'madhan', 'madhan@123', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    logging: false
});

sequelize.sync().then(() => {
    console.log('Database connected successfully');
}).catch(err => {
    console.log("There was a problem connecting to Database::: ", err);
});

var User = sequelize.define('user', {
    username: { type: Sequelize.STRING },
    password: { type: Sequelize.STRING },
    email: { type: Sequelize.STRING },
    role: { type: Sequelize.ENUM("admin", "user"), defaultValue: "user" },
});

var LoginHistory = sequelize.define('loginHistory', {
    userId: { type: Sequelize.INTEGER, allowNull: false },
    email: { type: Sequelize.STRING, allowNull: false },
    loginTime: { type: Sequelize.DATE, defaultValue: Sequelize.NOW},
});

module.exports = { User, LoginHistory };
