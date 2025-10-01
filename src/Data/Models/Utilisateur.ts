import { DataTypes, Model } from 'sequelize';
import { sequelize } from './index';

export class Utilisateur extends Model {
  id!: number;
  email!: string;
  role!: 'PUBLIC' | 'ORGANISATEUR';
  hashMdp!: string;
}

Utilisateur.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  role: { type: DataTypes.ENUM('PUBLIC', 'ORGANISATEUR'), allowNull: false },
  hashMdp: { type: DataTypes.STRING, allowNull: false }
}, { sequelize, modelName: 'utilisateur' });
