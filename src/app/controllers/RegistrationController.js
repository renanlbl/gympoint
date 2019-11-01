import * as Yup from 'yup';
import { parseISO, addMonths } from 'date-fns';

import Registration from '../models/Registration';
import Plan from '../models/Plan';
import Student from '../models/Student';

import Queue from '../../lib/Queue';
import RegistrationMail from '../jobs/RegistrationMail';

class RegistrationController {
  async index(req, res) {
    const registration = await Registration.findAll({
      attributes: [
        'id',
        'student_id',
        'plan_id',
        'start_date',
        'end_date',
        'price',
      ],
    });

    res.json(registration);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails' });
    }

    const { student_id, plan_id, start_date } = req.body;
    const plan = await Plan.findOne({
      where: { id: plan_id },
    });

    const student = await Student.findOne({
      where: { id: student_id },
    });

    const end_date = addMonths(parseISO(start_date), plan.duration);
    const price = plan.price * plan.duration;

    const studentOnPlan = await Registration.findOne({
      where: { student_id },
    });

    if (studentOnPlan) {
      return res
        .status(401)
        .json({ error: 'This student already have a plan' });
    }

    const registration = await Registration.create({
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    });

    await Queue.add(RegistrationMail.key, {
      student,
      plan,
      end_date,
    });

    return res.json(registration);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails ' });
    }

    const { id } = req.params;
    const { student_id, plan_id, start_date } = req.body;

    const plan = await Plan.findOne({
      where: { id: plan_id },
    });
    const end_date = addMonths(parseISO(start_date), plan.duration);
    const price = plan.price * plan.duration;

    const newRegister = await Registration.findByPk(id);

    const updateRegister = await newRegister.update({
      id,
      student_id,
      start_date,
      end_date,
      price,
    });

    return res.json(updateRegister);
  }

  async delete(req, res) {
    const { id } = req.params;
    const register = await Registration.findByPk(id);

    await Registration.destroy({
      where: { id: register.id },
    });

    return res.json();
  }
}

export default new RegistrationController();
