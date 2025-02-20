const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    clientName:{type: String, required: true},
    clientEmail:{type: String, required: true},
    clientPhone:{type: String, required: true},
    barber:{type: String, required: true},
    date:{type: Date, required: true},
    time:{type: String, required: true},
    status:{type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending'},
})

module.exports = mongoose.model('Appointment', appointmentSchema);