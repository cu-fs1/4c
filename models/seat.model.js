import client from '@/client.js';

export const bookSeatValues = {
    LOCKED: 'locked',
    LOCK_EXPIRY: 60
};

export const lockSeat = async (seatNumber) => {
    const lockKey = `seat_lock:${seatNumber}`;
    const result = await client.set(lockKey, bookSeatValues.LOCKED, {
        NX: true,
        EX: bookSeatValues.LOCK_EXPIRY
    });
    return result === 'OK';
};

export const getSeatTTL = async (seatNumber) => {
    const lockKey = `seat_lock:${seatNumber}`;
    return await client.ttl(lockKey);
};
