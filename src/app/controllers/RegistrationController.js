import { parseISO, addMonths } from 'date-fns';
import Registration from '../models/Registration';
import Plan from '../models/Plan';
// import Student from '../models/Student';

class RegistrationController {
  async store(req, res) {
    const { student_id, plan_id, start_date } = req.body;
    const plan = await Plan.findOne({
      where: { id: plan_id },
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

    return res.json(registration);
  }
}

export default new RegistrationController();
