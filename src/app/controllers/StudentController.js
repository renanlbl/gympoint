import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    const student = await Student.findOne({ where: { email: req.body.email } });

    if (student) {
      return res.status(400).json({ error: 'Student already exists' });
    }

    const { id, name, email, idade, peso, altura } = await Student.create(
      req.body
    );

    return res.json({
      id,
      name,
      email,
      idade,
      peso,
      altura,
    });
  }

  async update(req, res) {
    const { email } = req.body;

    const student = await Student.findOne({
      where: { email },
    });

    if (!student) {
      return res.json({ error: 'Student does not exists' });
    }

    const { id, name, idade, peso, altura } = await student.update(req.body);

    return res.json({
      id,
      name,
      email,
      idade,
      peso,
      altura,
    });
  }
}

export default new StudentController();
