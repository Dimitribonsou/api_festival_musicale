// src/api/controllers/ReservationController.ts

import { Request, Response } from 'express';
import * as ReservationService from '../../services/ReservationService';
import { logger } from '../../utils/logger';

interface ReservationRequestBody {
    concertId: number;
    nbPlaces: number;
    email: string; 

}

export const createReservation = async (req: Request, res: Response) => {
    const { concertId, nbPlaces, email } = req.body as ReservationRequestBody;

    if (!concertId || !nbPlaces || !email) {
        return res.status(400).json({ message: 'Concert ID, nombre de places et email sont requis.' });
    }

    if (nbPlaces <= 0) {
        return res.status(400).json({ message: 'Le nombre de places doit être supérieur à zéro.' });
    }

    try {
        const reservation = await ReservationService.create(concertId, nbPlaces, email);

        logger.info(`Nouvelle réservation créée: ID ${reservation.id} pour ${email}`);

        return res.status(201).json({ 
            message: 'Réservation effectuée avec succès.',
            reservationId: reservation.id, 
            concert: reservation.concert
        });

    } catch (error: any) {
        const statusCode = error.isBusinessError ? 409 : 500;
        return res.status(statusCode).json({ message: error.message });
    }
};