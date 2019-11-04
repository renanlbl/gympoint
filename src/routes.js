import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import RegistrationController from './app/controllers/RegistrationController';
import CheckinController from './app/controllers/CheckinController';
import HelpOrderController from './app/controllers/HelpOrderController';

import authMiddleware from './app/middlewares/auth';

const routers = new Router();

routers.post('/sessions', SessionController.store);

routers.use(authMiddleware);

routers.post('/students', StudentController.store);
routers.put('/students/:id', StudentController.update);

// Checkins
routers.get('/students/:id/checkins', CheckinController.index);
routers.post('/students/:id/checkins', CheckinController.store);

// Orders
routers.post('/students/:id/help-orders', HelpOrderController.store);
routers.get('/students/:id/help-orders', HelpOrderController.indexOne);
routers.get('/help-orders', HelpOrderController.index);
routers.put('/help-orders/:id', HelpOrderController.update);

routers.post('/plans', PlanController.store);
routers.get('/plans', PlanController.index);
routers.put('/plans/:id', PlanController.update);
routers.delete('/plans/:id', PlanController.delete);

routers.get('/registration', RegistrationController.index);
routers.post('/registration', RegistrationController.store);
routers.put('/registration/:id', RegistrationController.update);
routers.delete('/registration/:id', RegistrationController.delete);

export default routers;
