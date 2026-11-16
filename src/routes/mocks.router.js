import { Router } from 'express';
import { MocksController } from '../controllers/mocks.controller.js';

const router = Router();

// Endpoints de datos simulados (sin persistir)
router.get('/users', MocksController.getMockUsers);
router.get('/products', MocksController.getMockProducts);

// Endpoint de carga masiva en MongoDB (Seeding)
router.post('/seed', MocksController.seedDatabase);

export default router;