import express from 'express';
import { UserRoutes } from '../modules/user/user.route';

const router = express.Router();

const applicationRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
];

applicationRoutes.forEach(route => router.use(route.path, route.route));

export default router;
