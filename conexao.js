const mysql = require('mysql2');

exports.realizarConexao = function() {
    
    let con = mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'12345678',
        database:'projeto',
        multipleStatements: true
    });

    return con;

}
