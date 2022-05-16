const { request, response } = require('express');


const userLogin = async (req = request, res = response) => {
    
    const token = req.jtkn;

    res.status(200).render('dashboard', { token });
};

module.exports = {
    userLogin
};