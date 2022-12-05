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
    const getRequests = `SELECT COUNT(*) as total FROM requests WHERE employeeID = '${user.user.id}' AND (startDate  between '${req.body.startDate}' AND '${req.body.endDate}') OR (endDate  between '${req.body.startDate}' AND '${req.body.endDate}') OR (startDate <= '${req.body.startDate}' AND endDate >= '${req.body.endDate}')`
    try{
        connection.query(getRequests, function (err, results, fields){
            console.log(results);
            // res.send(results);
            if(results[0].total > 0){
                // res.send(results.total)
                res.status(400)
                return res.send('You already have a request in this duration')
            }else{
                let mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
                let query = `INSERT INTO requests(managerID, employeeID, type, startDate, endDate, numOfDays, status, createdAt) VALUES
                    ('${req.body.managerID}',
                    '${user.user.id}',
                    '${req.body.type}',
                    '${req.body.startDate}',
                    '${req.body.endDate}',
                    '${req.body.numOfDays}',
                    '${req.body.status}', 
                    '${mysqlTimestamp}')`;
                try{
                    connection.query(query, function (err, results, fields){
                        if(err){
                            return res.json(err);
                        }
                        return res.send('Your request has been sent successfully!')
                    });
                }catch (err){
                    return res.json(err)
                }
            }
        })

    } catch (err){
        console.log(err);
    }
        
}

function getEmployeeRequests(req, res){
    const user = jwt_decode(req.headers.authorization)
    let query = `SELECT * FROM requests WHERE employeeID = ${user.user.id}`;
    request(query, req, res);
}

function getRequestByID(req, res){
    let query = `SELECT employees.Fname , employees.Lname, employees.numOfLeaves ,requests.id,  requests.startDate , requests.endDate , requests.numOfDays , requests.type , requests.status FROM requests
    INNER JOIN employees  ON requests.employeeID  = employees.id
    WHERE requests.id  = ${req.params.id}`;
    request(query, req, res);
}

function getEmployeePrevRequests(req, res){
    let query = `SELECT employees.Fname , employees.Lname ,requests.id,  requests.startDate , requests.endDate , requests.numOfDays , requests.type , requests.status, requests.rejectionReason FROM requests
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
                    // console.log(results[2].email)/
                    if(req.body.status === 'Approved'){
                        employee = {name: `${result_.Fname} ${result_.Lname}` ,address: result_.email};
                        let hr = {name: `${results[2][0].Fname} ${results[2][0].Lname}` ,address: results[2][0].email};
                        subject = "Leave request approved";
                        contentEmployee = `Dear ${result_.Fname} ${result_.Lname},\nYour leave request from: ${moment(result_.startDate).format('DD-MM-YYYY')} to: ${moment(result_.endDate).format('DD-MM-YYYY')}  has been approved!\n Regards,`;

                        contentHR = `Dear ${results[2][0].Fname} ${results[2][0].Lname},\n A leave request has been approved for ${result_.Fname} ${result_.Lname} starting from: ${moment(result_.startDate).format('DD-MM-YYYY')} to: ${moment(result_.endDate).format('DD-MM-YYYY')}\n Regards, `;

                        sendEmail(employee, subject, contentEmployee);
                        sendEmail(hr, subject, contentHR);

                        // let receivers = [{name: results[2].Fname ,address: results[2].email}]
                    }else{
                        employee = {name: `${result_.Fname} ${result_.Lname}` ,address: result_.email};
                        subject = "Leave request rejected";
                        content = `Dear ${result_.Fname},\nYour leave request has been rejected for this reason: ${reason}.`;
                        sendEmail(employee, subject, content);
                    }
                    res.send('Request updated successfuly')
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
    console.log('rece', receivers)
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