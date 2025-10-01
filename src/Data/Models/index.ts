import { Sequelize } from 'sequelize';
import { Artiste } from './Artiste';
import { Scene } from './Scene';
import { Concert } from './Concert';
import { Utilisateur } from './Utilisateur';
import { Reservation } from './Reservation';

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'DB_NAME',
  username: 'user',
  password: 'ChangeMeNow123',
  logging: false
});

Artiste.hasMany(Concert, { foreignKey: 'artisteId' });
Concert.belongsTo(Artiste, { foreignKey: 'artisteId' });

Scene.hasMany(Concert, { foreignKey: 'sceneId' });
Concert.belongsTo(Scene, { foreignKey: 'sceneId' });

Utilisateur.hasMany(Reservation, { foreignKey: 'userId' });
Reservation.belongsTo(Utilisateur, { foreignKey: 'userId' });

Concert.hasMany(Reservation, { foreignKey: 'concertId' });
Reservation.belongsTo(Concert, { foreignKey: 'concertId' });

export { sequelize, Artiste, Scene, Concert, Utilisateur, Reservation };
