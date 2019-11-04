import Mail from '../../lib/Mail';

class ResponseMail {
  get key() {
    return 'ResponseMail';
  }

  async handle({ data }) {
    const { student, order, answer } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Nova resposta',
      template: 'response',
      context: {
        student: student.name,
        question: order.question,
        answer,
      },
    });
  }
}

export default new ResponseMail();
