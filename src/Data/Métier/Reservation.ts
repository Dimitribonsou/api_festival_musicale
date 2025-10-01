import { DataTypes, Model } from 'sequelize';
import sequelize from '../../Donnees/database';

export class Reservation extends Model {
  id!: number;
  concertId!: number;
  userId!: number;
  nbPlaces!: number;
  statut!: string;
  createdAt!: Date;
}

Reservation.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  concertId: { type: DataTypes.INTEGER, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  nbPlaces: { type: DataTypes.INTEGER, allowNull: false },
  statut: { type: DataTypes.STRING, allowNull: false },
  createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
}, { sequelize, modelName: 'reservation', updatedAt: false });
