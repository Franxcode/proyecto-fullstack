require('dotenv').config();
const fs = require('fs');

const { Client } = require('pg');

const migrate = async () => {
    const client = new Client();
    await client.connect();

    const users = fs.readFileSync('users.sql').toString();
    const tasks = fs.readFileSync('tasks.sql').toString();

    const resUsers = await client.query(users);
    const resTasks = await client.query(tasks);
    
    await client.end();
    return { 
        users: resUsers.rows, 
        tasks: resTasks.rows 
    }
}

migrate().then(()=> {
    console.log("Base de datos creada con éxito.");
    return;
}).catch((err)=> {
    console.log(`Hubo un error, por favor revisa. ${err}`);
    process.exit();
});