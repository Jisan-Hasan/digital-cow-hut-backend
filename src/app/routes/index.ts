import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { CowRoutes } from '../modules/cow/cow.route';
import { OrderRoutes } from '../modules/order/order.route';
import { UserRoutes } from '../modules/user/user.route';

const router = express.Router();

const applicationRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/cows',
    route: CowRoutes,
  },
  {
    path: '/orders',
    route: OrderRoutes,
  },
];

applicationRoutes.forEach(route => router.use(route.path, route.route));

export default router;
