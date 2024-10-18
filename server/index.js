require('dotenv').config();
const express = require('express');
const app = express();
const sequelize = require('./config/db');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const verifyJWT = require('./middleware/verifyJWT');

const PORT = process.env.PORT || 5000;



// Sync all models with the database
sequelize.sync()
    .then(() => console.log('All models were synchronized successfully.'))
    .catch(err => console.log('Failed to sync models:', err));

// custom middleware logger
app.use(logger);

// Custom middleware to set Access-Control-Allow-Credentials header  
app.use(credentials);

// Enable Cross-Origin Resource Sharing with specified options
app.use(cors(corsOptions));

// Parse incoming JSON requests
app.use(express.json());

// Parse URL-encoded data with querystring library
app.use(express.urlencoded({ extended: false }));

// Parse Cookie header and populate req.cookies
app.use(cookieParser());


// Routes
app.use('/api/auth/register', require('./routes/register'));
app.use('/api/auth/send-otp', require('./routes/verifyEmail'));
app.use('/api/auth/verify-otp', require('./routes/verifyOTP'));
app.use('/api/auth/login', require('./routes/login'));
app.use('/api/auth/token/refresh', require('./routes/refreshToken'));
app.use('/api/auth/logout', require('./routes/logout'));
app.use('/api/auth/forget-password', require('./routes/forgetPassword'));
app.use('/api/auth/reset-password', require('./routes/resetPassword'));

app.use(verifyJWT);
app.use('/api/users', require('./routes/users'));


app.all('*', (req, res) => {
    res.status(404).json({ message: 'Resource not found' });
});

// Error handler middleware
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});