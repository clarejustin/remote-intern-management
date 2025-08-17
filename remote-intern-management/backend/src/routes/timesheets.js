import { Router } from 'express';
import { listTimesheets, getTimesheet, createTimesheet, updateTimesheet, deleteTimesheet } from '../controllers/timesheetsController.js';

const router = Router();
router.get('/', listTimesheets);
router.post('/', createTimesheet);
router.get('/:id', getTimesheet);
router.put('/:id', updateTimesheet);
router.delete('/:id', deleteTimesheet);

export default router;
