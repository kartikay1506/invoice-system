const express = require('express');
const session = require('express-session');
const ejs = require('ejs');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const app = express();

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Bodyparser
app.use(express.json());
app.use(express.urlencoded({ limit: '1024mb', extended:true }));

//Sessions
app.use(session({
    secret: "Oberai Motors",
    resave: true,
    saveUninitialized: true
}));

//app.use(cors);

//Routes
app.use('/', require('./routes/index'));

//For Static Files
app.use(express.static(__dirname + '/assets'));

const port = process.env.PORT || 5000;
app.listen(port, console.log(`Server is running on port ${port}`));