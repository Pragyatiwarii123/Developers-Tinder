const express = require('express');

const app = express();

app.get('/user', (req, res) => {
    res.send({firstname: "pragya", lastname: "tiwari"});
});

app.post('/user', (req, res) => {
    res.send('Data Daved to DataBase!');
});

app.delete('/user', (req, res) => {
    res.send('Deleted Successfully!');
});

app.listen(7777, () => {
    console.log('Server is running on port 7777');
})