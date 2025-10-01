// src/services/ReservationService.ts

import * as ReservationRepository from "";

interface Reservation {
    id: string;
    concertId: number;
    concert: string;
    nbPlaces: number;
    statut: 'VALIDEE' | 'ANNULEE';
}

export async function create(concertId: number, nbPlaces: number, email: string): Promise<Reservation> {
    
    const capacityAvailable = await ReservationRepository.getAvailableCapacity(concertId);

    if (nbPlaces > capacityAvailable) {
        const error = new Error(`Impossible de réserver. Seules ${capacityAvailable} places sont disponibles.`);
        (error as any).isBusinessError = true; 
        throw error;
    }


    const newReservation = await ReservationRepository.save({ 
        concertId, 
        email, 
        nbPlaces,
    });


    return newReservation;
}