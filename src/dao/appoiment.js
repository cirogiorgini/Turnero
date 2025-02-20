const Appointment = require('../models/Appoiment');
const dayjs = require('dayjs');

class AppointmentDAO {
  async createAppointment(data) {
    const appointment = new Appointment(data);
    return await appointment.save();
  }

  async getAppointmentsByDate(date) {
    const startOfDay = dayjs(date).startOf('day').toDate();
    const endOfDay = dayjs(date).endOf('day').toDate();
    return await Appointment.find({ date: { $gte: startOfDay, $lt: endOfDay } });
  }
}

module.exports = new AppointmentDAO();
