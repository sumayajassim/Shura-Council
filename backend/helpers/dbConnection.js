
const mysql  = require('mysql');
const config = require('../config/database');
const connection = mysql.createConnection(config);

function request(query, req, res) {
    try{
        connection.query(query, function (err, results, fields){
            if(err){
                return res.json(err);
            }
            res.json(results)
        });
    }catch (err){
        res.json(err)
    }
}

module.exports = request