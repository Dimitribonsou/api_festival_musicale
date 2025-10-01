// Artiste.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../../Donnees/database';

export class Artiste extends Model {
  id!: number;
  nom!: string;
  genre!: string;
}

Artiste.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nom: { type: DataTypes.STRING, allowNull: false },
  genre: { type: DataTypes.STRING, allowNull: false },
}, { sequelize, modelName: 'artiste' });
