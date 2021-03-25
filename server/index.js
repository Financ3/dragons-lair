const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env')});
const express = require('express');
const massive = require('massive');
const session = require('express-session');
const authCtrl = require('./controllers/authController');
const authMiddleWare = require('./middleware/authMiddleware');
const treasureCtrl = require('./controllers/treasureController');

const { PORT, CONNECTION_STRING, SESSION_SECRET } = process.env;

//create our express app for making CRUD requests
const app = express();

//top level middleware to convert response bodies into JSON
app.use(express.json());

//top level middleware to create a session on the server
app.use(session({
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
}));

app.post('/auth/register', authCtrl.register);
app.post('/auth/login', authCtrl.login);
app.get('/auth/logout', authCtrl.logout);
app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure);
app.get('/api/treasure/user', authMiddleWare.usersOnly, treasureCtrl.getUserTreasure);
app.post('/api/treasure/user', authMiddleWare.usersOnly, treasureCtrl.addUserTreasure);
app.get('/api/treasure/all', authMiddleWare.usersOnly, authMiddleWare.adminsOnly, treasureCtrl.getAllTreasure);

//establish the database connection and start the server
massive({
    connectionString: CONNECTION_STRING,
    ssl: {
        rejectUnauthorized: false
    }
}, {scripts: './../db'})
.then(dbInstance => {
    app.set('db', dbInstance);
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    });
}).catch(err=>console.log(err));
