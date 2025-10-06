import { DataTypes, Model } from "sequelize";
import { sequelize } from "../sequelize.js";

export class ParameterModel extends Model<{ key: string; value: string }> {}
ParameterModel.init(
  {
    key: { type: DataTypes.STRING, primaryKey: true },
    value: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize, tableName: "parameters", underscored: true }
);
