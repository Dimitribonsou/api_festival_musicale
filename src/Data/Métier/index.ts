import sequelize from '../../Donnees/database';
import { Artiste } from './Artiste';
import { Scene } from './Scene';
import { Concert } from './Concert';
import { Utilisateur } from './Utilisateur';
import { Reservation } from './Reservation';

// Associations
Artiste.hasMany(Concert, { foreignKey: 'artisteId' });
Concert.belongsTo(Artiste, { foreignKey: 'artisteId' });

Scene.hasMany(Concert, { foreignKey: 'sceneId' });
Concert.belongsTo(Scene, { foreignKey: 'sceneId' });

Utilisateur.hasMany(Reservation, { foreignKey: 'userId' });
Reservation.belongsTo(Utilisateur, { foreignKey: 'userId' });

Concert.hasMany(Reservation, { foreignKey: 'concertId' });
Reservation.belongsTo(Concert, { foreignKey: 'concertId' });

export { sequelize, Artiste, Scene, Concert, Utilisateur, Reservation };
