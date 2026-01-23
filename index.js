import express from 'express';
import cors from 'cors';
import client from './client.js';
import bookingRoutes from './routes/bookingRoutes.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Ticket Booking API with Redis Locks');
});

// Use the booking routes
app.use('/api', bookingRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
