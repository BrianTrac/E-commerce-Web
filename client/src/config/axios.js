import axios from 'axios';
// load the environment variables from the .env file

const BASE_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';

export default axios.create({
    baseURL: BASE_URL
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});