import express, { Request, Response, Application } from 'express';
import dotenv from 'dotenv';

dotenv.config();

interface Concert {
    id: number;
    nom: string;
    capaciteMax: number;
    reservationsActuelles: number;
}

interface Reservation {
    id: string;
    concertId: number;
    nbPlaces: number;
    email: string;
    createdAt: Date;
    statut: 'VALIDEE' | 'ANNULEE';
}

const concertsDB: Concert[] = [
    { id: 101, nom: "The Rockers Show", capaciteMax: 1000, reservationsActuelles: 950 },
    { id: 102, nom: "Pop Divas Night", capaciteMax: 600, reservationsActuelles: 150 },
    { id: 103, nom: "Jazz Club", capaciteMax: 250, reservationsActuelles: 250 },
];

const reservationsDB: Reservation[] = [];

const ConcertRepository = {
    findById: (id: number): Concert | undefined => {
        return concertsDB.find(c => c.id === id);
    },
    updateReservations: (id: number, delta: number): void => {
        const concert = ConcertRepository.findById(id);
        if (concert) {
            concert.reservationsActuelles += delta;
        }
    }
};

const ReservationService = {
    create: (concertId: number, nbPlaces: number, email: string): Reservation => {
        const concert = ConcertRepository.findById(concertId);

        if (!concert) {
            throw new Error('Concert non trouvé.');
        }

        const capaciteRestante = concert.capaciteMax - concert.reservationsActuelles;
        if (nbPlaces <= 0 || nbPlaces > capaciteRestante) {
            const error = new Error(`Capacité dépassée. ${capaciteRestante} places disponibles.`);
            (error as any).status = 409;
            throw error;
        }

        const newReservation: Reservation = {
            id: `RES-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            concertId,
            nbPlaces,
            email,
            createdAt: new Date(),
            statut: 'VALIDEE'
        };

        ConcertRepository.updateReservations(concertId, nbPlaces);
        reservationsDB.push(newReservation);
        
        return newReservation;
    }
};

const ReservationController = {
    createReservation: (req: Request, res: Response) => {
        const { concertId, nbPlaces, email } = req.body;

        if (!concertId || !nbPlaces || !email) {
            return res.status(400).json({ message: 'Concert ID, nombre de places et email sont requis.' });
        }
        
        try {
            const reservation = ReservationService.create(concertId, nbPlaces, email);

            return res.status(201).json({
                message: 'Réservation effectuée avec succès.',
                reservationId: reservation.id,
                concertId: reservation.concertId,
                nbPlaces: reservation.nbPlaces
            });

        } catch (error: any) {
            const status = error.status || 500;
            return res.status(status).json({ message: error.message });
        }
    }
};

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.status(200).send({ message: "Festival API MVP - Running" });
});

app.post('/reservations', ReservationController.createReservation);

app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 Serveur Express Monolithe simple démarré sur le port ${PORT}`);
    console.log(`======================================================`);
    console.log(`\nEndpoints de test:`);
    console.log(`- POST http://localhost:${PORT}/reservations`);
    console.log(`  (Body: { "concertId": 102, "nbPlaces": 50, "email": "test@public.fr" })`);
    console.log(`\nCapacités initiales pour le test:`);
    concertsDB.forEach(c => console.log(`- ${c.nom} (${c.id}): ${c.reservationsActuelles}/${c.capaciteMax}`));
    console.log(`\n(Ctrl+C pour arrêter le serveur)`);
});