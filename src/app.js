require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const router = require('../routers/router');


const app = express();
const PORT = process.env.PORT || 4000;

///// DB connection 

mongoose.connect(process.env.DB_URI);
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', () => console.log("Connection ready"));

// midleware

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(session({
    secret: 'popa',
    saveUninitialized: true,
    resave: false
}))

app.use((req, res, next) => {
    res.locals.massage = req.session.massage;
    delete req.session.massage;
    next();
})

/// View Engine 
app.set('view engine', 'ejs');
app.use('', router);

/////////////////

app.listen(PORT, () => {
    console.log(`Server http://localhost:${PORT}`);
});