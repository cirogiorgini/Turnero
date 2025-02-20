const AppointmentService = require('../service/appoimentService');

class AppointmentsController {
  async createAppointment(req, res) {
    try {
      const { clientName, clientPhone, clientEmail, barber, date, time } = req.body;
      
      const appointment = await AppointmentService.assignAppointment({
        clientName,
        clientPhone,
        clientEmail,
        barber,
        date,
        time,
      });

      res.status(201).json({ message: 'Turno asignado con éxito', appointment });
      console.log(appointment)
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async generateSlots(req, res) {
    try {
      const generatedSlots = await AppointmentService.generateAndSaveAvailableAppointments();
      res.status(201).json({ message: 'Turnos generados y guardados', slots: generatedSlots });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getAvailableSlots(req, res) {
    try {
      const availableSlots = await AppointmentService.getAvailableAppointments();
      res.status(200).json({ message: 'Turnos disponibles', availableAppointments: availableSlots });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new AppointmentsController();
