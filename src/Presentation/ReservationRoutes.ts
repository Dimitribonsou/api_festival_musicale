import { Router } from 'express';
import { createReservation, listConcerts } from './ReservationController';

export const ReservationRoutes = () => {
    const router = Router();
    router.post('/reservations', createReservation);
    router.get('/concerts', listConcerts);
    return router;
};
