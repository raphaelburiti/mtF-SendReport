const express = require('express');

const CustomerController = require('./controllers/CustomerController');
const ReportController = require('./controllers/ReportController');

const routes = express.Router();

routes.post('/call/report', ReportController.report)

routes.post('/customer', CustomerController.store)
routes.get('/customer', CustomerController.indexById)

module.exports = routes;