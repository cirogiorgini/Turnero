const dayjs = require('dayjs');
const AppointmentDAO = require('../dao/appoiment');
const AppointmentSlotDAO = require('../dao/appointmentSlot');
const transport = require('../utils/transport')

class AppointmentService {

  async assignAppointment({ clientName, clientPhone, clientEmail, barber, serviceType, date, time }) {
    try {
      // Normalizar fecha usando dayjs
      const appointmentDate = dayjs(date).startOf('day');

      // Verificar si el slot está disponible
      const slot = await AppointmentSlotDAO.getSlotByDateAndTime(appointmentDate.toDate(), time);
      if (!slot) {
        throw new Error('El horario no existe.');
      }

      if (!slot.isAvailable) {
        throw new Error('El horario no está disponible. Por favor, elige otro.');
      }

      // Crear el turno
      const appointment = await AppointmentDAO.createAppointment({
        clientName,
        clientPhone,
        clientEmail,
        barber,
        serviceType,
        date: appointmentDate.toDate(),
        time,
      });
      // Enviar correo electrónico de confirmación
      await transport.sendMail({
        from: 'no-reply@turnero.com',
        to: clientEmail,
        subject: 'Confirmación de turno',
        text: `Hola ${clientName},\n\nTu turno con ${barber} ha sido confirmado para el ${appointmentDate.format('DD/MM/YYYY')} a las ${time}.\n\nGracias por elegirnos.\n\nSaludos,\nTurnero`
      });
      // Actualizar la disponibilidad del slot
      await AppointmentSlotDAO.updateSlotAvailability(appointmentDate.toDate(), time, false);

      return appointment;
    } catch (error) {
      console.error('Error en assignAppointment:', error.message);
      throw error;
    }
  }


  // Validar si la hora está en el rango permitido
  isValidTime(time) {
    const [hour] = time.split(':').map(Number);
    return hour >= 9 && hour <= 18; // 7 p.m. es la hora 18
  }

  // Verificar si el horario está disponible
  async isTimeSlotAvailable(date, time) {
    const appointments = await AppointmentDAO.getAppointmentsByDate(date);
    return !appointments.some((appointment) => appointment.time === time);
  }

  async generateAndSaveAvailableAppointments() {
    const today = dayjs().startOf('day');
    const startOfNextWeek = today.day() === 0 ? today.add(1, 'day') : today.add(8 - today.day(), 'day');
    const endOfNextWeek = startOfNextWeek.add(5, 'day');

    // Limpiar turnos existentes en la base de datos para la semana
    await AppointmentSlotDAO.clearWeekSlots(startOfNextWeek.toDate(), endOfNextWeek.toDate());

    const slotsToSave = [];
    for (let i = 0; i <= 5; i++) {
      const currentDate = startOfNextWeek.add(i, 'day');
      const startHour = 9;
      const endHour = 19;
      const hours = Array.from({ length: endHour - startHour + 1 }, (_, idx) => `${startHour + idx}:00`);

      for (const time of hours) {
        slotsToSave.push({
          date: currentDate.toDate(),
          time,
        });
      }
    }

    // Guardar turnos en la base de datos
    await AppointmentSlotDAO.saveSlots(slotsToSave);

    return slotsToSave;
  }

  async getAvailableAppointments() {
    const today = dayjs().startOf('day');
    const startOfNextWeek = today.day() === 0 ? today.add(1, 'day') : today.add(8 - today.day(), 'day');
    const endOfNextWeek = startOfNextWeek.add(5, 'day');

    // Consultar turnos disponibles en la base de datos
    const availableSlots = await AppointmentSlotDAO.getSlotsForWeek(
      startOfNextWeek.toDate(),
      endOfNextWeek.toDate()
    );

    // Agrupar turnos por fecha
    const groupedSlots = availableSlots.reduce((acc, slot) => {
      const date = dayjs(slot.date).format('YYYY-MM-DD');
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(slot.time);
      return acc;
    }, {});

    return Object.keys(groupedSlots).map((date) => ({
      date,
      freeSlots: groupedSlots[date],
    }));
  }
}

module.exports = new AppointmentService();
