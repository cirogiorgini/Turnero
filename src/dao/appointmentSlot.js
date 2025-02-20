const AppointmentSlot = require('../models/ApointmentSlot');

class AppointmentSlotDAO {
  async clearWeekSlots(startDate, endDate) {
    return AppointmentSlot.deleteMany({
      date: { $gte: startDate, $lte: endDate },
    });
  }

  async updateSlotAvailability(date, time, isAvailable) {
    try {
      return await AppointmentSlot.updateOne(
        { date, time },
        { isAvailable }
      );
    } catch (error) {
      console.error('Error en updateSlotAvailability:', error);
      throw new Error('Error al actualizar disponibilidad.');
    }
  }

  async getSlotByDateAndTime(date, time) {
    return await AppointmentSlot.findOne({ date, time });
  }

  async saveSlots(slots) {
    return AppointmentSlot.insertMany(slots);
  }

  async getSlotsForWeek(startDate, endDate) {
    return AppointmentSlot.find({
      date: { $gte: startDate, $lte: endDate },
      isAvailable: true,
    });
  }
}

module.exports = new AppointmentSlotDAO();
