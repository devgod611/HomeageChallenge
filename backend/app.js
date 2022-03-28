const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// const sqlite = require('sqlite3');
// const env = require('dotenv').load();
const port = process.env.PORT || 8080;
const cors = require('cors');

// models
const models = require("./models");

// routes
const books = require('./routes/books');
const centers = require('./routes/centers');
const nurses = require('./routes/nurses');
const nurse_workdays = require('./routes/nurse_workdays');

//Sync Database
models.sequelize.sync().then(function() {
    console.log('connected to database')
}).catch(function(err) {
    console.log(err)
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// register routes
app.use('/books', books);
app.use('/centers', centers);
app.use('/nurses', nurses);
app.use('/nurse_workdays', nurse_workdays);

// index path
app.get('/', function(req, res){
    console.log('app listening on port: '+port);
    res.send('tes express nodejs sqlite')
});

app.listen(port, function(){
    console.log('app listening on port: '+port);
});

module.exports = app;