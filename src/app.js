const express = require('express');

const { adminAuth, userAuth } = require('./middleware/auth');

const app = express();


// app.use('/admin', (req, res, next) => {
//     const token = "abcd"
//     isAuthorized = token === "abc";
//     if (!isAuthorized) {
//         return res.status(403).send('Unauthorised Access');
//     } else {
//         next();
//     }

// });

app.get('/admin/getUserData', adminAuth, (req, res, next) => {
    // const token = "abc"
    // isAuthorized = token === "abc";
    // if (!isAuthorized) {
    //     return res.status(403).send('Unauthorised Access');
    // } else {
    //     res.send('Admin Data');
    // }

    res.send('Admin Data');
});


app.delete('/admin/deleteUser', adminAuth, (req, res, next) => {
    // const token = "abc"
    // isAuthorized = token === "abc";
    // if (!isAuthorized) {
    //     return res.status(403).send('Unauthorised Access');
    // } else {
    //     res.send('User Deleted');
    // }

    res.send('User Deleted');
});


app.get('/user/getProfile', userAuth, (req, res, next) => {
    // const token = "abc"
    // isAuthorized = token === "abc";
    // if (!isAuthorized) {
    //     return res.status(403).send('Unauthorised Access');
    // } else {
    //     res.send('Profile Data');
    // }

    res.send('Profile Data');
});


app.post('/user/createProfile', (req, res, next) => {
    res.send('Profile Data Created');
});

app.listen(7777, () => {
    console.log('Server is running on port 7777');
})