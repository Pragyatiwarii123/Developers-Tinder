const express = require('express');
const { connectDb } = require('./config/database');
const cookieParser = require('cookie-parser');
const authRouter = require('./router/auth');
const profileRouter = require('./router/profile');
const connectionsRouter = require('./router/connectionRequest');


const app = express();

//middleware to parse cookies from incoming requests
app.use(cookieParser());

//creating a middle ware to convert incoming json request to javascript object
app.use(express.json());



app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", connectionsRouter)

connectDb()
    .then(() => {
        console.log('Database Connected Successfully');
        app.listen(7777, () => {
            console.log('Server is running on port 7777');
        })
    }).catch((err) => {
        console.error('Database Connection Failed', err);
    });

