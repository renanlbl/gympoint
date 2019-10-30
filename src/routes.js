import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import RegistrationController from './app/controllers/RegistrationController';

import authMiddleware from './app/middlewares/auth';

const routers = new Router();

routers.post('/sessions', SessionController.store);

routers.use(authMiddleware);

routers.post('/students', StudentController.store);
routers.put('/students', StudentController.update);

routers.post('/plans', PlanController.store);
routers.get('/plans', PlanController.index);
routers.put('/plans/:id', PlanController.update);
routers.delete('/plans/:id', PlanController.delete);

routers.post('/registration', RegistrationController.store);

export default routers;
