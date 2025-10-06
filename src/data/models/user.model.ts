import { DataTypes, Model } from "sequelize";
import { sequelize } from "../sequelize.js";
import type { UserRole } from "../../business/entities/User.js";

export class UserModel extends Model<{
  id: number;
  email: string;
  role: UserRole;
  passwordHash: string;
}> {}

UserModel.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    role: {
      type: DataTypes.ENUM("PUBLIC", "ORGANISATEUR"),
      allowNull: false,
      defaultValue: "PUBLIC",
    },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize, tableName: "users", underscored: true }
);
