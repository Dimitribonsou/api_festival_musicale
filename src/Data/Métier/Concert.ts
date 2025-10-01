import { DataTypes, Model } from 'sequelize';
import { sequelize } from './index';

export class Concert extends Model {
  id!: number;
  sceneId!: number;
  artisteId!: number;
  debut!: Date;
  fin!: Date;
  capaciteMax!: number;
  statut!: string;
}

Concert.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  sceneId: { type: DataTypes.INTEGER, allowNull: false },
  artisteId: { type: DataTypes.INTEGER, allowNull: false },
  debut: { type: DataTypes.DATE, allowNull: false },
  fin: { type: DataTypes.DATE, allowNull: false },
  capaciteMax: { type: DataTypes.INTEGER, allowNull: false },
  statut: { type: DataTypes.STRING, allowNull: false }
}, { sequelize, modelName: 'concert' });
