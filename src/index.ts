import express from 'express';
import type { Application } from 'express';
import dotenv from 'dotenv';
import  sequelize  from '../src/Données/database';
import { ReservationRoutes } from './Présentation/Routes/ReservationRoutes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api', ReservationRoutes()); 

app.get('/', (req, res) => {
    res.send({ message: 'Festival API running' });
});

sequelize.authenticate().then(() => {
    console.log("✅ DB connectée");
    app.listen(PORT, () => console.log(`🚀 Serveur sur http://localhost:${PORT}`));
}).catch(err => console.error("❌ DB error:", err));
