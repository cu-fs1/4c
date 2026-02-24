import express from 'express';
import { bookSeat } from '../controllers/booking.controller.js';

const router = express.Router();

/**
 * POST /api/book
 * Book a specific seat.
 */
router.post('/book', bookSeat);

export default router;
