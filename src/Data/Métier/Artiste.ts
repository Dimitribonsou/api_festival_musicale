import { DataTypes, Model } from 'sequelize';
import { sequelize } from './index';

export class Artiste extends Model {
  id!: number;
  nom!: string;
  genre!: string;
  bioCourte?: string;
  liens?: string;
}

Artiste.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nom: { type: DataTypes.STRING, allowNull: false },
  genre: { type: DataTypes.STRING, allowNull: false },
  bioCourte: { type: DataTypes.TEXT, allowNull: true },
  liens: { type: DataTypes.STRING, allowNull: true }
}, { sequelize, modelName: 'artiste' });
