import { DataTypes, Model } from "sequelize";
import { sequelize } from "../sequelize.js";
import { ConcertModel } from "./concert.model.js";

export class ReservationModel extends Model {
  declare id: number;
  declare concertId: number;
  declare email: string;
  declare qty: number;
  declare status: "CONFIRMED" | "CANCELLED";
  declare createdAt: Date;
}

ReservationModel.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    concertId: { type: DataTypes.INTEGER, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    qty: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1 } },
    status: {
      type: DataTypes.ENUM("CONFIRMED", "CANCELLED"),
      defaultValue: "CONFIRMED",
    },
  },
  {
    sequelize,
    tableName: "reservations",
    underscored: true,
    indexes: [{ unique: true, fields: ["concert_id", "email"] }],
  }
);

ReservationModel.belongsTo(ConcertModel, {
  foreignKey: "concertId",
  as: "concert",
});
ConcertModel.hasMany(ReservationModel, {
  foreignKey: "concertId",
  as: "reservations",
});
