const express = require('express');
const router = express.Router();
const requestController = require('../controllers/request');
const isLoggedIn = require('../helpers/isLoggedIn');

router.get('/request',isLoggedIn, requestController.getAllRequests); // get all requests sent to the manager.
router.post('/request', isLoggedIn, requestController.newRequest); // create new request
router.get('/request/employee',isLoggedIn, requestController.getEmployeeRequests); // get all employee requests.
router.get('/request/:id', requestController.getRequestByID); // get request by ID .
router.get('/request/employee/:id', requestController.getEmployeePrevRequests); // get request by ID .
router.delete('/request/:id', requestController.deleteRequest); // delete request by ID
router.put('/request/:id', requestController.updateRequest); // create new request


module.exports = router