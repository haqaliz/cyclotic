import express from 'express';
import { users as usersController } from '../controllers/index.js';
const router = express.Router();

router.get('/:id/recorded-days', usersController.getRecordedDaysForUser);

export default router;
