const cookieParser = require('cookie-parser');
const express = require('express');
const hbs = require('hbs');

const { userLogin } = require('./controllers/login.controller');
const { userRegister } = require('./controllers/register.controller');
const { generateJWT } = require('./helpers/generate-jwt');
const { validateJWT } = require('./helpers/validate-jwt');

const app = express();
const port = 3000;

// Handlebars
hbs.registerPartials(__dirname + '/views/partials');

app.set('view engine', 'hbs');
app.use( express.json() );
app.use( express.urlencoded({ extended: true }) );
app.use( cookieParser() );
// Register
app.get('/', (req, res) => res.render('register'));

app.post('/', userRegister);

// Login

app.get('/login', (req, res) => res.render('login'));

app.post('/login', generateJWT, validateJWT);

// Dashboard

app.get('/dashboard', validateJWT, (req, res) => res.render('dashboard'));

// Admin

app.get('/admin', validateJWT, (req, res) => req.isAdmin ? res.render('admin') : res.redirect('/dashboard'));

// Logout

app.get('/logout', (req, res) => {
    res.clearCookie(process.env.SESSIONCOOKIE);
    res.redirect('/login');
});



app.listen(port, () => console.log(`Server initialized at port ${port}.`));