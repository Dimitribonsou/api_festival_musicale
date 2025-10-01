import { DataTypes, Model } from 'sequelize';
import { sequelize } from './index';

export class Scene extends Model {
  id!: number;
  nom!: string;
  capacite!: number;
}

Scene.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nom: { type: DataTypes.STRING, allowNull: false },
  capacite: { type: DataTypes.INTEGER, allowNull: false }
}, { sequelize, modelName: 'scene' });
