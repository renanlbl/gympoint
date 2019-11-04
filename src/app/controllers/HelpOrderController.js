import * as Yup from 'yup';
import Student from '../models/Student';
import HelpOrder from '../models/HelpOrder';
import Queue from '../../lib/Queue';
import ResponseMail from '../jobs/ResponseMail';

class HelpOrderController {
  async index(req, res) {
    const answers = await HelpOrder.findAll({
      where: { answer: null },
    });

    return res.json(answers);
  }

  async indexOne(req, res) {
    const { id } = req.params;

    const student = await Student.findOne({
      where: { id },
    });

    if (!student) {
      return res.status(400).json({ error: 'This students doesnt exists' });
    }

    const orders = await HelpOrder.findAll({
      where: { student_id: id },
    });
    return res.json(orders);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails' });
    }

    const { id } = req.params;

    const student = await Student.findOne({
      where: { id },
    });

    if (!student) {
      return res.status(400).json({ error: 'This students doesnt exists' });
    }

    const { question, answer } = req.body;

    const order = await HelpOrder.create({
      student_id: id,
      question,
      answer,
    });

    return res.json(order);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails' });
    }

    const { id } = req.params;
    const order = await HelpOrder.findByPk(id);

    if (!order) {
      return res.status(400).json({ error: 'This order doenst exists' });
    }

    const student = await Student.findByPk(id);

    const answer_at = new Date();

    const { answer } = await order.update({ ...req.body, answer_at });

    await Queue.add(ResponseMail.key, {
      student,
      answer,
      order,
    });

    return res.json({
      id,
      answer,
      answer_at,
    });
  }
}

export default new HelpOrderController();
