const express = require('express');
const hbs = require('hbs');
const { insertUser } = require('./models/queries');

const app = express();
const port = 3000;

// Handlebars
hbs.registerPartials(__dirname + '/views/partials');

app.set('view engine', 'hbs');
app.use( express.json() );
app.use( express.urlencoded({ extended: true }) );

app.get('/', (req, res) => {
    res.render('register');
});

app.post('/', async (req, res) => {
    const { email, password } = req.body;

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if(email.match(emailRegex) && password) {
        const response = await insertUser(email, password);
        if (!response.severity) {
            res.status(200).render('login', {
                message: 'Usuario creado con éxito.',
                response
            });
            return;
        }
        const errorMessages = {
            "users_email_key": "El correo electrónico ya fue utilizado"
        }

        res.status(409).render('register', {
            error: `${errorMessages[response.constraint]}.`
        });
    }else{
        res.status(500).render('register', {
            message: 'Ha ocurrido un error, contacta al administrador.'
        });
    }
});

app.listen(port, () => console.log(`Server initialized at port ${port}.`));