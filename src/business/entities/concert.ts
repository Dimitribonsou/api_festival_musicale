import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../data/sequelize.js";
import { ArtistModel } from "../../data/models/artist.model.js";
import { StageModel } from "../../data/models/stage.model.js";

export class ConcertModel extends Model {
  declare id: number;
  declare stageId: number;
  declare artistId: number;
  declare startAt: Date;
  declare endAt: Date;
  declare maxCapacity: number;
  declare status: "SCHEDULED" | "CANCELLED" | "DONE";
}

ConcertModel.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    stageId: { type: DataTypes.INTEGER, allowNull: false },
    artistId: { type: DataTypes.INTEGER, allowNull: false },
    startAt: { type: DataTypes.DATE, allowNull: false },
    endAt: { type: DataTypes.DATE, allowNull: false },
    maxCapacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 0 },
    },
    status: {
      type: DataTypes.ENUM("SCHEDULED", "CANCELLED", "DONE"),
      defaultValue: "SCHEDULED",
    },
  },
  { sequelize, tableName: "concerts", underscored: true }
);

ArtistModel.hasMany(ConcertModel, { foreignKey: "artistId" });
StageModel.hasMany(ConcertModel, { foreignKey: "stageId" });
ConcertModel.belongsTo(ArtistModel, { foreignKey: "artistId" });
ConcertModel.belongsTo(StageModel, { foreignKey: "stageId" });
