const jwt_decode = require('jwt-decode');
const request = require('../helpers/dbConnection')
const mysql  = require('mysql');
const config = require('../config/database');
const nodemailer = require('nodemailer');
const connection = mysql.createConnection(config);  
const moment = require('Moment')
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    },
    });


function getAllRequests(req, res){
    const user = jwt_decode(req.headers.authorization)
    let query = `SELECT employees.Fname , employees.Lname ,requests.id,  requests.startDate , requests.endDate , requests.numOfDays , requests.type , requests.status  FROM requests
    INNER JOIN employees  ON requests.employeeID  = employees.id
    WHERE requests.managerID  = ${user.user.id} AND requests.status = 'Pending'`;
    request(query, req, res);
}

function newRequest(req, res){
    const user = jwt_decode(req.headers.authorization)
    let query = `INSERT INTO requests(managerID, employeeID, type, startDate, endDate, numOfDays, status) VALUES
        ('${req.body.managerID}',
        '${user.user.id}',
        '${req.body.type}',
        '${req.body.startDate}',
        '${req.body.endDate}',
        '${req.body.numOfDays}',
        '${req.body.status}')`;
        try{
            connection.query(query, function (err, results, fields){
                if(err){
                    return res.json(err);
                }
                res.send('Your request has been sent successfully!')
            });
        }catch (err){
            res.json(err)
        }
        
}

function getEmployeeRequests(req, res){
    const user = jwt_decode(req.headers.authorization)
    let query = `SELECT * FROM requests WHERE employeeID = ${user.user.id}`;
    request(query, req, res);
}

function getRequestByID(req, res){
    let query = `SELECT employees.Fname , employees.Lname, employees.numOfLeaves ,requests.id,  requests.startDate , requests.endDate , requests.numOfDays , requests.type , requests.status  FROM requests
    INNER JOIN employees  ON requests.employeeID  = employees.id
    WHERE requests.id  = ${req.params.id}`;
    request(query, req, res);
}

function getEmployeePrevRequests(req, res){
    let query = `SELECT employees.Fname , employees.Lname ,requests.id,  requests.startDate , requests.endDate , requests.numOfDays , requests.type , requests.status  FROM requests
    INNER JOIN employees  ON requests.employeeID  = employees.id
    WHERE requests.id <> ${req.params.id} `;
    request(query, req, res);
}

function deleteRequest(req, res){
    let query = `DELETE FROM requests WHERE id=${req.params.id}`;
    request(query, req, res);
}

function updateRequest(req, res){
    let reason;
    let receivers = [];
    let subject = "";
    let content = "";
    if(req.body.status !== 'Rejected'){
       reason = null;
    }else{
        reason = req.body.reason
    }
    const query_ =  `SELECT employees.numOfLeaves, employees.Fname, employees.Lname, employees.email ,requests.employeeID, requests.startDate, requests.endDate, requests.numOfDays  FROM requests
    INNER JOIN employees  ON requests.employeeID  = employees.id
    WHERE requests.id  = ${req.params.id}`;
    let result_ ;
    try{
        connection.query(query_, function (err, results, fields){
            if(err){
                return res.json(err);
            }
            result_ =  results[0];
            const updatedLeaves = result_.numOfLeaves - result_.numOfDays ;
            const queries = `UPDATE employees SET numOfLeaves ='${updatedLeaves}' WHERE id=${result_.employeeID}; UPDATE requests SET status='${req.body.status}', rejectionReason='${reason}'  WHERE id=${req.params.id};
            SELECT email, Fname, Lname FROM employees WHERE role LIKE 'HR';`
            try{
                connection.query(queries, [0,1,2], function(err, results, fields){
                    if(req.body.status === 'Approved'){
                        receivers = [{name: `${result_.Fname} ${result_.Lname}` ,address: result_.email},
                                        {name: `${results[2].Fname} ${results[2].Lname}` ,address: results[2].email}];
                        subject = "Leave request approved";
                        content = `Dear ${result_.Fname} ${result_.Lname},
                                    Your leave request from: ${moment(result_.startDate).format('DD-MM-YYYY')} to: ${moment(result_.endDate).format('DD-MM-YYYY')}has been approved!`;

                        
                        // let receivers = [{name: results[2].Fname ,address: results[2].email}]
                    }else{
                        receivers = [{name: `${result_.Fname} ${result_.Lname}` ,address: result_.email}];
                        subject = "Leave request rejected";
                        content = `Dear ${result_.Fname},
                                    Your leave request has been rejected for this reason: ${reason}.`;
                    }
                    sendEmail(receivers, subject, content);
                })
            }catch (err){
                res.json(err)
            }

        });
    }catch (err){
        res.json(err)
    }
    // let query = `UPDATE requests SET status = '${req.body.status}' WHERE id=${req.params.id}`;
}

function sendEmail(receivers, subject , content){
    const mailOptions = {
        from: `${process.env.EMAIL}`,
        to: receivers,
        subject: subject,
        text: content,
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = {
    getAllRequests,
    newRequest,
    getEmployeeRequests,
    getRequestByID,
    deleteRequest,
    updateRequest,
    getEmployeePrevRequests
}