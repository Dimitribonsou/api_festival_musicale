import { Reservation, Concert, Artiste, Scene } from '../../Data/Models/models';

export const create = async (concertId: number, userId: number, nbPlaces: number) => {
    const concert = await Concert.findByPk(concertId, {
        include: [{ model: Reservation, where: { statut: 'VALIDEE' }, required: false }]
    });

    if (!concert) {
        const error = new Error('Concert non trouvé.');
        (error as any).status = 404;
        throw error;
    }

    const dejaReserve = concert.getDataValue('reservations')?.reduce((sum: number, res: Reservation) => sum + res.NbPlaces, 0) || 0;
    const capaciteRestante = concert.CapaciteMax - dejaReserve;

    if (nbPlaces > capaciteRestante) {
        const error = new Error(`Capacité dépassée (${capaciteRestante} places restantes).`);
        (error as any).status = 409;
        throw error;
    }

    return await Reservation.create({ concertId, userId, nbPlaces, statut: 'VALIDEE' });
};

export const listConcerts = async () => {
    return Concert.findAll({
        include: [
            { model: Artiste, attributes: ['nom', 'genre'] },
            { model: Scene, attributes: ['nom'] }
        ]
    });
};
