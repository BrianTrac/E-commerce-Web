// const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
//     host: process.env.DB_HOST,
//     dialect: 'postgres',
//     logging: false,
// });

// sequelize.authenticate()
//     .then(() => console.log('PostgreSQL connected successfully!'))
//     .catch(err => console.log('Unable to connect to PostgreSQL', err));

// module.exports = sequelize;

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_URL);
sequelize.authenticate()
    .then(() => console.log('PostgreSQL connected successfully!'))
    .catch(err => console.log('Unable to connect to PostgreSQL', err));

module.exports = sequelize;