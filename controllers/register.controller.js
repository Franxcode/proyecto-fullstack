const { request, response } = require('express');
const { insertUser } = require('../models/queries');

const userRegister = async (req = request, res = response) => {
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
};

module.exports = {
    userRegister
}