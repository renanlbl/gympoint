import { Router } from 'express';

import SessionController from './app/controllers/SessionController';

// import authMiddleware from './app/middlewares/auth';

const routers = new Router();

routers.post('/sessions', SessionController.store);

export default routers;
