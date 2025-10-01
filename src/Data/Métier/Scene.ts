import { DataTypes, Model } from 'sequelize';
import sequelize from '../../Donnees/database';

export class Scene extends Model {
  id!: number;
  nom!: string;
  capacite!: number;
}

Scene.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nom: { type: DataTypes.STRING, allowNull: false },
  capacite: { type: DataTypes.INTEGER, allowNull: false },
}, { sequelize, modelName: 'scene', timestamps: false });
