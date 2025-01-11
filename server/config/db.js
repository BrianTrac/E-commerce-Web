const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_URL, { logging: false });
sequelize.authenticate()
    .then(() => console.log('PostgreSQL connected successfully!'))
    .catch(err => console.log('Unable to connect to PostgreSQL', err));

module.exports = sequelize;