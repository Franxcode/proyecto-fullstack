CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE tasks (
    id_task uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    tasks_id_user uuid DEFAULT uuid_generate_v4(),
    task_name VARCHAR(255) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tasks_id_user) REFERENCES users(id_user));