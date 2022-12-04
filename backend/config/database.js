const mysql = require('mysql')
const config = {
    host: "127.0.0.1",
    user: "root",
    password: "sumaya",
    port:3306,
    database: 'shuraCouncil',
    multipleStatements: true
    // socketPath: 'mysql-socket-path',
}

 const connection = mysql.createConnection(config);

  connection.connect(function(err) {
    if (err) {
      return console.error('error: ' + err.message);
    }
    console.log('Connected to the MySQL server.');

    // let createEmployee = `create table if not exists employees(id int AUTO_INCREMENT, Fname VARCHAR(30),Lname VARCHAR(30), role VARCHAR(30), email VARCHAR(50), Password VARCHAR(100), ManagerID INT, numOfLeaves INT, PRIMARY KEY(id), CONSTRAINT FK_PersonOrder FOREIGN KEY (ManagerID) REFERENCES employees(id))`;
    let createRequests = `create table if not exists requests(id int AUTO_INCREMENT, managerID INT, employeeID INT, startDate DATE, endDate DATE, numOfDays INT,type VARCHAR(50), status VARCHAR(25), rejectionReason VARCHAR(500), PRIMARY KEY(id), CONSTRAINT FK_employeeID FOREIGN KEY (employeeID) REFERENCES employees(id), CONSTRAINT FK_managerID FOREIGN KEY (managerID) REFERENCES employees(id))`;
  
    connection.query(createRequests, (err, results, fields) => {
      if (err) {
        console.log(err.message);
      }else{
        console.log("Employee table created");
      }
    });
  
    connection.end(function(err) {
      if (err) {
        return console.log(err.message);
      }
    });
  });

module.exports = config;

