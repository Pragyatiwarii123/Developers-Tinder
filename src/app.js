const express = require('express');

const app = express();
// ///xyyyyyyyyyyyyx //any number of y in between x and z
// app.get('/xy+z', (req, res) => {
//     res.send({firstname: "pragya", lastname: "tiwari"});
// });
// //xyPRAGYATIWARIz //anytthing in between xy and z
// app.get('/xy*z', (req, res) => {
//     res.send({firstname: "pragya", lastname: "tiwari"});
// });
// //abbbcd, abcd, abcbcd //bc should appear at least once
// app.get('/a(bc)+d', (req, res) => {
//     res.send({firstname: "pragya", lastname: "tiwari"});
// });
// /**
//  * /butterfly
// /dragonfly
// /superfly
//  */
// app.get('/.*fly$', (req, res) => {
//     res.send({firstname: "pragya", lastname: "tiwari"});
// });

//http://localhost:7777/user?userId=11
app.get('/user', (req, res) => {
    console.log(req.query);
    res.send({firstname: "pragya", lastname: "tiwari"});
});
//http://localhost:7777/user/11
app.get('/user/:userId', (req, res) => {
    console.log(req.params);
    res.send({firstname: "pragya", lastname: "tiwari"});
});



app.listen(7777, () => {
    console.log('Server is running on port 7777');
})