import mysql from "mysql"

export const db=mysql.createConnection({
    host:"localhost",
    user:"my_app_user",
    password:"MyNewPass1!",
    database:"audiochatbot",
    timezone: '+0800',
    connectionLimit: 10,
    connectTimeout: 10000,
    waitForConnections: true,
    queueLimit: 0
})
