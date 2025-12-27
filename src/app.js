const express = require('express');

const app = express();


// app.get('/user/getProfile', (req, res, next) => {
//     throw new Error('Simulated Server Error');
//     res.send('Profile Data Fetched Successfully');
// });

// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send('Something broke!');
// });


/////////////////////////. or. ///////////////////////


app.get('/user/getProfile', (req, res, next) => {
    try {
        throw new Error('Simulated Server Error');
        res.send('Profile Data Fetched Successfully');
    }catch (err) {
        res.status(500).send('Something went wrong!');
    }
    
});

app.listen(7777, () => {
    console.log('Server is running on port 7777');
})