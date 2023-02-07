const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
mongoose.connect("mongodb://useradmin:I'mth3@k1@27.0.0.1:27017/codial_development");

const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error connecting to mongodb"));

db.once('open', () => {
        console.log("successfully connected to the database");
});

module.exports = db;