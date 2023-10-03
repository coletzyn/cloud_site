const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');


//Import routes
const authRoute = require('./routes/auth.js');
const postRoute = require('./routes/home.js');
const loginRoute = require('./routes/loginRoute.js');


dotenv.config();

const connectToMongo = async () => {
    await mongoose.connect(process.env.DB_CONNECT);
    console.log('connected to db');
};

connectToMongo();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());

//Route Middleware
app.use('/api/user', authRoute);
app.use('/home', postRoute);
app.use('/', loginRoute)


app.listen(80, () => console.log('server is running'));

