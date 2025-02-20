const express = require('express');
const AppointmentsController = require('../controllers/appoimentsController');

const router = express.Router();

router.post('/', AppointmentsController.createAppointment.bind(AppointmentsController));

router.post('/generate', AppointmentsController.generateSlots);

router.get('/available', AppointmentsController.getAvailableSlots);

module.exports = router;
