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

const insertTodo = async (id, todo) => {
    const query = 'INSERT INTO tasks (tasks_id_user, task_name) VALUES ($1, $2) RETURNING*';
    const values = [id, todo];

    try {
        const client = new Client;
        await client.connect();
        const result = await client.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.log("insertTodo", error);
        return error;
    }
};

const getTodos = async (id) => {
    const query = 'SELECT * FROM tasks WHERE tasks_id_user = $1 ORDER BY fecha DESC';
    const values = [id];

    try {
        const client = new Client;
        await client.connect();
        const result = await client.query(query, values);
        return result.rows;
    } catch (error) {
        console.log("getTodos", error);
        return error;
    }
};

const updateTodo = async (id, todo, date) => {
    const query = 'UPDATE tasks SET task_name = $1, fecha = $2 WHERE id_task = $3 RETURNING*';
    const values = [todo, date, id];

    try {
        const client = new Client;
        await client.connect();
        const result = await client.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.log("updateTodo", error);
        return error;
    }
};

const deleteTodo = async (id) => {
    const query = 'DELETE FROM tasks WHERE id_task = $1';
    const values = [id];

    try {
        const client = new Client;
        await client.connect();
        const result = await client.query(query, values);
        return result.rowCount;
    } catch (error) {
        console.log("deleteTodo", error);
        return error;
    }
};

module.exports = {
    insertUser,
    getUser,
    insertTodo,
    getTodos,
    updateTodo,
    deleteTodo
}