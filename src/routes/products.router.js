import { Router } from 'express';
import { ProductsController } from '../controllers/products.controller.js';

const router = Router();

router.get('/', ProductsController.getAll);
router.get('/:pid', ProductsController.getById);
router.post('/', ProductsController.create);
router.put('/:pid', ProductsController.update);
router.delete('/:pid', ProductsController.delete);

export default router;