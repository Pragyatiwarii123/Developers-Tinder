const { mongoose } = require('mongoose');


const connectDb = async () => {
    await mongoose.connect('mongodb+srv://pragyatiwari831_db_user:xoM2VOsw8T2UI8RF@cluster5.of05jju.mongodb.net/devTinder')
}

module.exports = {
    connectDb
}