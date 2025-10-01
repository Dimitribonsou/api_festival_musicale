import express, { type Request, type Response, type Application } from 'express';
import dotenv from 'dotenv';
import { Artiste, Scene, Concert, Utilisateur, Reservation, sequelize } from './models';

dotenv.config();

async function initializeDatabase() {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ force: true }); 

        const scene = await Scene.create({ nom: 'Grande Scène', capacite: 1500 });
        const artiste1 = await Artiste.create({ nom: 'The Rockers Show', genre: 'Rock' });
        const artiste2 = await Artiste.create({ nom: 'Pop Divas Night', genre: 'Pop' });
        
        const user = await Utilisateur.create({ email: 'test@public.fr', role: 'PUBLIC', hashMdp: 'hashedpassword' });
        const initialUserId = user.Id;

        const concert1 = await Concert.create({
            sceneId: scene.Id,
            artisteId: artiste1.Id, 
            debut: new Date(Date.now() + 86400000), 
            fin: new Date(Date.now() + 86400000 + 3600000),
            capaciteMax: 1000,
            statut: 'PREVU'
        });
        const concert2 = await Concert.create({
            sceneId: scene.Id,
            artisteId: artiste2.Id,
            debut: new Date(Date.now() + 172800000),
            fin: new Date(Date.now() + 172800000 + 3600000),
            capaciteMax: 600,
            statut: 'PREVU'
        });

        console.log(`Données de base insérées. Utilisateur ID: ${initialUserId}`);
        return { initialUserId, concert1, concert2 };

    } catch (error) {
        console.error('Erreur lors de l\'initialisation de la base de données:', error);
        process.exit(1);
    }
}

const ReservationService = {
    create: async (concertId: number, userId: number, nbPlaces: number): Promise<Reservation> => {
        const concert = await Concert.findByPk(concertId, {
            include: [{
                model: Reservation,
                attributes: ['nbPlaces'],
                where: { statut: 'VALIDEE' },
                required: false
            }]
        });

        if (!concert) {
            const error = new Error('Concert non trouvé.');
            (error as any).status = 404;
            throw error;
        }

        const reservationsValidees = concert.getDataValue('reservations') as Reservation[] | undefined;
        const placesDejaReservees = reservationsValidees
            ? reservationsValidees.reduce((sum, res) => sum + res.NbPlaces, 0)
            : 0;

        const capaciteRestante = concert.CapaciteMax - placesDejaReservees;
        
        if (nbPlaces <= 0 || nbPlaces > capaciteRestante) {
            const error = new Error(`Capacité dépassée. ${capaciteRestante} places disponibles.`);
            (error as any).status = 409;
            throw error;
        }

        const newReservation = await Reservation.create({
            concertId,
            userId,
            nbPlaces,
            statut: 'VALIDEE',
            createdAt: new Date()
        });
        
        return newReservation;
    }
};

const ReservationController = (initialUserId: number) => ({
    createReservation: async (req: Request, res: Response) => {
        const userId = initialUserId; 
        const { concertId, nbPlaces } = req.body;
        
        if (!concertId || !nbPlaces) {
            return res.status(400).json({ message: 'Concert ID et nombre de places sont requis.' });
        }
        
        const idConcert = parseInt(concertId as string, 10);
        const places = parseInt(nbPlaces as string, 10);
        
        if (isNaN(idConcert) || isNaN(places)) {
            return res.status(400).json({ message: 'Concert ID et nombre de places doivent être des nombres.' });
        }

        try {
            const reservation = await ReservationService.create(idConcert, userId, places);

            return res.status(201).json({
                message: 'Réservation effectuée avec succès.',
                reservationId: reservation.Id,
                concertId: reservation.ConcertId,
                nbPlaces: reservation.NbPlaces,
                userId: reservation.UserId
            });

        } catch (error: any) {
            const status = error.status || 500;
            return res.status(status).json({ message: error.message });
        }
    },
    
    listConcerts: async (req: Request, res: Response) => {
        try {
            const concerts = await Concert.findAll({
                include: [
                    { model: Artiste, attributes: ['nom', 'genre'] },
                    { model: Scene, attributes: ['nom'] }
                ]
            });
            
            return res.status(200).json(concerts);
        } catch (error) {
            return res.status(500).json({ message: "Erreur lors de la récupération des concerts." });
        }
    }
});

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.status(200).send({ message: "Festival API MVP - Running with Sequelize" });
});

initializeDatabase().then(({ initialUserId, concert1, concert2 }) => {
    
    const controller = ReservationController(initialUserId);
    
    app.post('/reservations', controller.createReservation);
    app.get('/concerts', controller.listConcerts);

    const c1Id = concert1.Id;
    const c1Capacite = concert1.CapaciteMax;
    const c2Id = concert2.Id;
    const c2Capacite = concert2.CapaciteMax;

    app.listen(PORT, () => {
        console.log(`\n======================================================`);
        console.log(`🚀 Serveur Express Monolithe Sequelize démarré sur le port ${PORT}`);
        console.log(`======================================================`);
        console.log(`\nEndpoints de test:`);
        console.log(`- GET http://localhost:${PORT}/concerts`);
        console.log(`- POST http://localhost:${PORT}/reservations`);
        console.log(`  (Body: { "concertId": ${c2Id}, "nbPlaces": 50 })`);
        console.log(`\nCapacités initiales pour le test:`);
        console.log(`- Concert ID ${c1Id}: ${c1Capacite} places`);
        console.log(`- Concert ID ${c2Id}: ${c2Capacite} places`);
        console.log(`\n(Ctrl+C pour arrêter le serveur)`);
    });
});