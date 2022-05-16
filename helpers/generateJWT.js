const jwt = require('jsonwebtoken');
const { request, response } = require('express');
const { getUser } = require('../models/queries');

const generateJWT = async (req = request, res = response, next) => {

    const { email, password } = req.body;
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if(email.match(emailRegex) && password) {
        const response = await getUser(email, password);
        if (!response.severity) {
            try {
                const payload = { email };
                const token = jwt.sign(payload, process.env.SECRETKEY, {
                    expiresIn: '2m',
                });
                req.jtkn = token;
                next();
                return;
            } catch (error) {
                console.log("generateJWT", error);
                return error;
            }
        }
    }else{
        res.status(400).render('login', {
            error: 'Revisa tu correo electrónico o contraseña'
        });
    }
};

module.exports = {
    generateJWT
}