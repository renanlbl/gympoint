import { format, subDays, startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';
import Checkin from '../models/Checkin';
import Student from '../models/Student';
import Registration from '../models/Registration';

class CheckinController {
  async index(req, res) {
    const { id } = req.params;

    const student = await Student.findOne({
      where: { id },
    });

    if (!student) {
      return res.status(400).json({ error: 'This students doesnt exists' });
    }

    const checkins = await Checkin.findAll({
      where: { student_id: id },
    });
    return res.json(checkins);
  }

  async store(req, res) {
    const { id } = req.params;
    const student = await Student.findOne({
      where: { id },
    });

    if (!student) {
      return res.status(400).json({ error: 'This students doesnt exists' });
    }

    const stundentRegister = await Registration.findOne({
      where: { student_id: id },
    });

    if (!stundentRegister) {
      return res
        .status(400)
        .json({ error: 'This students doesnt have register' });
    }

    const oldDate = format(subDays(new Date(), 7), 'yyyy-MM-dd');

    const qntCheckin = await Checkin.count({
      where: {
        student_id: id,
        created_at: {
          [Op.between]: [startOfDay(parseISO(oldDate)), endOfDay(new Date())],
        },
      },
    });

    if (qntCheckin === 5) {
      return res.status(400).json({ error: 'Maximum login reached ' });
    }

    const checkin = await Checkin.create({
      student_id: id,
    });
    return res.json(checkin);
  }
}

export default new CheckinController();
