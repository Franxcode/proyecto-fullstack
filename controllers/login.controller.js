const jwt = require('jsonwebtoken');
const { request, response } = require('express');
const { getUser } = require('../models/queries');

const logIn = async (req = request, res = response) => {

    const { email, password } = req.body;
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    try {
        if(email.match(emailRegex) && password) {
            const response = await getUser(email, password);
            if (!response.severity) {
                try {
                    // Crear Token
                    const token = jwt.sign({
                        exp: Math.floor(Date.now() / 1000) + 120,
                        userId: response.id_user,
                        isAdmin: response.is_admin
                    }, process.env.SECRETKEY);
                    response.is_admin ? 
                    res.cookie(process.env.SESSIONCOOKIE, token, {
                        maxAge: 300000000,
                        secure: true,
                    }).redirect('/admin')
                    :
                    res.cookie(process.env.SESSIONCOOKIE, token, {
                        maxAge: 30000000,
                        secure: true,
                    }).redirect('/dashboard');
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
    } catch (error) {
        return res.status(500).render('login', {
            error: 'Hable con el administrador.'
        });
    }
};

module.exports = {
    logIn
}