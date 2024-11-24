import express from 'express';
import { authenticate } from '../controllers/authController.js';

const router = express.Router();

router.post('/', authenticate);

export default router;
