import { Scene, Artiste, Concert, Reservation } from "../Metier/model";

export const create = async (concertId: number, userId: number, nbPlaces: number) => {
    // Récupération du concert avec ses réservations validées
    const concert = await Concert.findByPk(concertId, {
        include: [{ model: Reservation, where: { statut: 'VALIDEE' }, required: false }]
    });

    if (!concert) {
        const error = new Error('Concert non trouvé.');
        (error as any).status = 404;
        throw error;
    }

    // Récupération des réservations incluses via get() et cast
    const reservations = concert.get('Reservations') as Reservation[] | undefined;

    // Calcul du nombre de places déjà réservées
const dejaReserve = reservations?.reduce((sum, res) => sum + res.NbPlaces, 0) || 0;

    // Calcul de la capacité restante
const capaciteRestante = concert.CapaciteMax - dejaReserve;

    if (nbPlaces > capaciteRestante) {
        const error = new Error(`Capacité dépassée (${capaciteRestante} places restantes).`);
        (error as any).status = 409;
        throw error;
    }

    // Création de la réservation
    return await Reservation.create({ concertId, userId, nbPlaces, statut: 'VALIDEE' });
};

export const listConcerts = async () => {
    return Concert.findAll({
        include: [
            { model: Artiste, attributes: ['nom', 'genre'] },
            { model: Scene, attributes: ['nom'] },
            { model: Reservation, attributes: ['nbPlaces', 'statut'], required: false }
        ]
    });
};
