import { Router } from 'express';
import { listTasks, getTask, createTask, updateTask, deleteTask } from '../controllers/tasksController.js';

const router = Router();
router.get('/', listTasks);
router.post('/', createTask);
router.get('/:id', getTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
