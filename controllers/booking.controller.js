import { lockSeat, getSeatTTL, bookSeatValues } from '@/models/seatModel.js';

export const bookSeat = async (req, res) => {
    const { seat_number } = req.body;

    if (!seat_number) {
        return res.status(400).json({ success: false, error: 'seat_number is required' });
    }

    try {
        const isLocked = await lockSeat(seat_number);

        if (isLocked) {
            // Lock acquired successfully
            res.status(200).json({
                success: true,
                message: `Seat ${seat_number} booked successfully. Lock active for 1 minute.`,
                bookingId: Date.now(),
                seat_number,
                expires_in: bookSeatValues.LOCK_EXPIRY
            });
        } else {
            // Lock exists, meaning someone else booked it (or is holding it)
            const ttl = await getSeatTTL(seat_number);
            res.status(409).json({
                success: false,
                error: `Seat ${seat_number} is currently locked.`,
                try_again_in_seconds: ttl
            });
        }
    } catch (error) {
        console.error('Booking error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
