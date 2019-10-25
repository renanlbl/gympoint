import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';

import authMiddleware from './app/middlewares/auth';

const routers = new Router();

routers.post('/sessions', SessionController.store);

routers.use(authMiddleware);

routers.post('/students', StudentController.store);
routers.put('/students', StudentController.update);

export default routers;
