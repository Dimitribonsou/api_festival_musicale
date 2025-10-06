import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../data/sequelize.js";

export class StageModel extends Model<{
  id: number;
  name: string;
  capacity: number;
}> {}
StageModel.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1 },
    },
  },
  { sequelize, tableName: "stages", underscored: true }
);
