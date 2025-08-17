import { Router } from 'express';
import { listInterns, createIntern, getIntern, updateIntern, deleteIntern } from '../controllers/internsController.js';

const router = Router();
router.get('/', listInterns);
router.post('/', createIntern);
router.get('/:id', getIntern);
router.put('/:id', updateIntern);
router.delete('/:id', deleteIntern);

export default router;
