const express = require('express');
const { connectDb } = require('./config/database');
const cookieParser = require('cookie-parser');
const authRouter = require('./router/auth');
const profileRouter = require('./router/profile');
const requestsRouter = require('./router/request');
const userRequestRouter = require('./router/user');
const cors = require('cors');


const app = express();


app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

app.use(cookieParser());

//creating a middle ware to convert incoming json request to javascript object
app.use(express.json());


app.use("/api", authRouter)
app.use("/api", profileRouter)
app.use("/api", requestsRouter)
app.use("/api", userRequestRouter)

connectDb()
  .then(() => {
    console.log('Database Connected Successfully');
    app.listen(7777, () => {
      console.log('Server is running on port 7777');
    })
  }).catch((err) => {
    console.error('Database Connection Failed', err);
  });

