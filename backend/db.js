const mariadb = require('mariadb');

const pool = mariadb.createPool({
     host: '127.0.0.1', 
     user: 'root', 
     password: 'a1b2c3',
     database: 'sistema_frotas',
     connectionLimit: 5
});

module.exports = pool;