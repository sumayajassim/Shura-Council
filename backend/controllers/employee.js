const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql  = require('mysql');
const config = require('../config/database');
const connection = mysql.createConnection(config);
const request = require('../helpers/dbConnection')
const salt = 10;

function signup(req, res){
    try{
        let hashedPassword = bcrypt.hashSync(req.body.Password, salt);
        console.log(req.body)
        let query = `INSERT INTO employees(Fname, Lname, email, ManagerID, role, numOfLeaves, Password) VALUES(
                    '${req.body.Fname}',
                    '${req.body.Lname}',
                    '${req.body.email}',
                    ${req.body.ManagerID},
                    '${req.body.role}',
                    ${req.body.numOfLeaves},
                    '${hashedPassword}')`;
        connection.query(query, function (err, result, fields){
            if(err){
                return console.error('error: ' + err.message);
            }
            console.log('results', result);
            res.send('Employee has been created successfully!')
        });

        // connection.end();
    }catch (err){
        console.log(err);
    }
} 

function login(req, res){
    let {email, Password} = req.body;
    try{
        let query =  `SELECT * FROM employees WHERE email = '${email}'`;
        connection.query(query, (err, result, fields) =>{

            if(result.length == 0){
                res.status(400)
                return res.json({error: "User not found!"});
            }
            if( bcrypt.compareSync(Password ,result[0].Password)){
                const payload = {
                    user: {
                        id: result[0].id,
                    }
                }
                jwt.sign(
                    payload,
                    process.env.SECRET,
                    {expiresIn: "3h"},
                    (err ,token) => {
                        if(err) throw err;
                        res.json({token}).status(200)
                    }
                )
            }else{
                res.status(401)
                return res.json({error: "Password not matched!"});
            }  
        })
    }catch (err){
        res.status(400)
        res.json({error: "You are not loggedin, please try again later!"});
    }
}

function getUserByID(req, res){
    try{
        let query = `SELECT * FROM employees WHERE id = ${req.params.id}`;
        request(query, req, res);
    }catch (err){
        console.log(err);
    }
}

module.exports = {
    signup,
    getUserByID,
    login
}