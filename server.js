const moment = require('moment');
const cookieParser = require('cookie-parser');
const express = require('express');
const hbs = require('hbs');

const { logIn } = require('./controllers/login.controller');
const { logOut } = require('./controllers/logout.controller');
const { userRegister } = require('./controllers/register.controller');
const { validateJWT } = require('./helpers/validate-jwt');
const { insertTodo, getTodos, deleteTodo, updateTodo, getUsers } = require('./models/queries');

const app = express();
const port = 3000;
moment.locale('es');
// Handlebars
hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper("counter", (index) => {
    return index + 1;
});

app.set('view engine', 'hbs');
app.use( express.json() );
app.use( express.urlencoded({ extended: true }) );
app.use( cookieParser() );
// Register
app.get('/', (req, res) => res.render('register'));

app.post('/', userRegister);

// Login

app.get('/login', (req, res) => res.render('login'));

app.post('/login', logIn, validateJWT);

// Dashboard

app.get('/dashboard', validateJWT, async (req, res) => {
    const id = req.userId;
    const response = await getTodos(id);
    const formattedResponse = response.map(todo => {
        const formattedDate = moment(todo.fecha).format("LLL");
        return {
            ...todo,
            formattedDate
        }
    });
    res.render('dashboard', { formattedResponse });
});

app.post('/dashboard', validateJWT, async (req, res) => {
    const id = req.userId;
    const { todo } = req.body;
    await insertTodo(id, todo);
    res.redirect('/dashboard');
});

app.put('/dashboard/edit', validateJWT, async (req, res) => {
    const { id, task } = req.body;
    const date = moment().format('YYYY MM DD, h:mm:ss a');
    await updateTodo(id, task, date);
    res.status(200).end();
});

app.get('/dashboard/delete/:id', validateJWT, async (req, res) => {
    const { id } = req.params;
    await deleteTodo(id);
    res.redirect('/dashboard');
});

// Admin

app.get('/admin', validateJWT, async (req, res) => {

    const response = await getUsers();
    const formattedResponse = response.map(todo => {
        const formattedDate = moment(todo.fecha).format("LLL");
        return {
            ...todo,
            formattedDate
        }
    });

    if(req.isAdmin) {
        res.render('admin', { formattedResponse });
    }else {
        res.redirect('/dashboard');
    }
});

// Logout

app.get('/logout', logOut);

app.listen(port, () => console.log(`Server initialized at port ${port}.`));