require('dotenv').config()

const { Client } = require('pg');

const insertUser = async (email, password) => {

    const query = 'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *';

    try {
        const client = new Client;
        await client.connect();
        const values = [email, password];
        const result = await client.query(query, values);
        return result.rows[0];
    } catch (error) {
        return error;
    }
};

const getUser = async (email, password) => {

    const query = 'SELECT * FROM users WHERE email = $1 AND password = $2';
    const values = [email, password];

    try {
        const client = new Client;
        await client.connect();
        const result = await client.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.log("getUser", error);
        return error;
    }
};

module.exports = {
    insertUser,
    getUser
}