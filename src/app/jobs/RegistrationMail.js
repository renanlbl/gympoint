import pt from 'date-fns/locale/pt';
import { format, parseISO } from 'date-fns';
import Mail from '../../lib/Mail';

class RegistrationMail {
  get key() {
    return 'RegistrationMail';
  }

  async handle({ data }) {
    const { student, plan, end_date } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Cadastro concluído',
      template: 'register',
      context: {
        student: student.name,
        plan: plan.title,
        end_date: format(
          parseISO(end_date),
          "'dia' dd 'de' MMMM', às ' H:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new RegistrationMail();
