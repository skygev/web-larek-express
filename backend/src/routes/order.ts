import { Router } from 'express';
import { createOrder } from '../controllers/order';
import { createOrderValidation } from '../validation/schemas';

const router = Router();

router.post('/', createOrderValidation, createOrder);

export default router;
