const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employee')

router.post('/employee/signup', employeeController.signup);
router.post('/employee/login', employeeController.login);
router.get('/employee/:id', employeeController.getUserByID);

module.exports = router