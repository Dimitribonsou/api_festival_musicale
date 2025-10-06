import { Op } from "sequelize";
import { ReservationModel } from "../models/reservation.model.js";

export class ReservationRepository {
  list() {
    return ReservationModel.findAll({ order: [["createdAt", "DESC"]] });
  }
  forEmail(email: string) {
    return ReservationModel.findAll({
      where: { email },
      order: [["createdAt", "DESC"]],
    });
  }
  findDuplicate(concertId: number, email: string) {
    return ReservationModel.findOne({
      where: { concertId, email: { [Op.iLike]: email } },
    });
  }
  create(d: Partial<ReservationModel>, options?: { transaction?: any }) {
    return ReservationModel.create(d as any, options as any);
  }
  byId(id: number) {
    return ReservationModel.findByPk(id);
  }
  cancel(id: number) {
    return ReservationModel.update({ status: "CANCELLED" }, { where: { id } });
  }
  delete(id: number) {
    return ReservationModel.destroy({ where: { id } });
  }
}
