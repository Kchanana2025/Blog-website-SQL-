//this code will help us build connection with the database

const mysql = require('mysql2/promise');//we are importing third party package

const pool = mysql.createPool({
    host: 'localhost',//host is basically jispe ye database server chal rha hai  server.
    database: 'blog',
    user: 'root',
    password: 'Library@2001'
    //user and password we choose when we installed MySQL in our system.
});

//this command will create pool of connections with database
//bdi websites mein this statement is very useful because it helps in handling multiple concurrent requests at the same time.

module.exports = pool;
//we will import this pool in files wherever we wish to
// run queries on our database.(database is blog here)

//Note:localhost ke port 3306 pe database server chalta hai.aur ye port apne app configure ho jata hai

//bahar bhjne ko exports kehte hain
//andr bulane ko imports kehte hain