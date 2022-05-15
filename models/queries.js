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
        console.log(error);
        return error;
    }
};

module.exports = {
    insertUser
}