import { DataTypes, Model } from "sequelize";
import { sequelize } from "../sequelize.js";

export class ArtistModel extends Model<{
  id: number;
  name: string;
  genre?: string;
  bioShort?: string;
  links?: string;
}> {}
ArtistModel.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    genre: DataTypes.STRING,
    bioShort: DataTypes.TEXT,
    links: DataTypes.TEXT,
  },
  { sequelize, tableName: "artists", underscored: true }
);
