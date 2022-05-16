require('dotenv').config()

const { Client } = require('pg');

const insertUser = async (email, password) => {

    const query = 'INSERT INTO users (email, password, is_admin) VALUES ($1, $2, $3) RETURNING *';

    try {
        const client = new Client;
        await client.connect();
        const counter = await client.query('SELECT COUNT(*) AS count FROM users');
        const [{ count }] = counter.rows;
        let isAdmin = false;
            if (Number(count) === 0) {
                isAdmin = true;
            }
        const values = [email, password, isAdmin];
        const result = await client.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.log("insertUser", error);
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