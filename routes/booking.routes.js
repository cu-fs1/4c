import express from 'express';
import { bookSeat } from '@/controllers/bookingController.js';

const router = express.Router();

/**
 * POST /api/book
 * Book a specific seat.
 */
router.post('/book', bookSeat);

export default router;
