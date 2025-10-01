import { Request, Response } from 'express';
import * as ReservationService from '../../Data/Services/ReservationService';
import { Utilisateur } from '../../Data/Métier/Utilisateur';

export const createReservation = async (req: Request, res: Response) => {
    const { concertId, nbPlaces, email } = req.body;

    if (!concertId || !nbPlaces || !email) {
        return res.status(400).json({ message: "Champs requis manquants." });
    }

    try {
        let user = await Utilisateur.findOne({ where: { email } });

        if (!user) {
            user = await Utilisateur.create({
                email,
                role: 'PUBLIC',
                hashMdp: 'defaultpassword'
            });
        }

        const reservation = await ReservationService.create(concertId, user?.id, nbPlaces);
        res.status(201).json(reservation);
    } catch (error: any) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

export const listConcerts = async (req: Request, res: Response) => {
    try {
        const concerts = await ReservationService.listConcerts();
        res.status(200).json(concerts);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
