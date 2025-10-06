import { Op, col, fn, literal } from "sequelize";
import { ConcertModel } from "../models/concert.model.js";
import { ReservationModel } from "../models/reservation.model.js";
import { ArtistModel } from "../models/artist.model.js";
import { StageModel } from "../models/stage.model.js";

export class ConcertRepository {
  withStats(where: any = {}) {
    return ConcertModel.findAll({
      where,
      include: [
        { model: ArtistModel, attributes: ["id", "name"] },
        { model: StageModel, attributes: ["id", "name", "capacity"] },
        { model: ReservationModel, as: "reservations", attributes: [] },
      ],
      attributes: {
        include: [
          [fn("COALESCE", fn("SUM", col("reservations.qty")), 0), "reserved"],
          [
            literal('"max_capacity" - COALESCE(SUM(reservations.qty),0)'),
            "remaining",
          ],
        ],
      },
      includeIgnoreAttributes: false,
      subQuery: false,
      group: ["ConcertModel.id", "ArtistModel.id", "StageModel.id"],
      order: [
        ["startAt", "ASC"],
        ["id", "ASC"],
      ],
    } as any);
  }

  details(id: number) {
    return this.withStats({ id }).then((rows) => rows[0] ?? null);
  }

  findOverlap(stageId: number, startAt: Date, endAt: Date, excludeId?: number) {
    return ConcertModel.findOne({
      where: {
        stageId,
        id: excludeId ? { [Op.ne]: excludeId } : { [Op.not]: null },
        [Op.and]: [
          { startAt: { [Op.lt]: endAt } },
          { endAt: { [Op.gt]: startAt } }, // interval overlap
        ],
      },
    });
  }

  create(d: Partial<ConcertModel>) {
    return ConcertModel.create(d as any);
  }
  update(id: number, d: Partial<ConcertModel>) {
    return ConcertModel.update(d, { where: { id }, returning: true }).then(
      (r) => r[1][0] ?? null
    );
  }
  delete(id: number) {
    return ConcertModel.destroy({ where: { id } });
  }
  byId(id: number) {
    return ConcertModel.findByPk(id);
  }

  reservedQty(concertId: number) {
    return ReservationModel.sum("qty", {
      where: { concertId, status: "CONFIRMED" },
    }).then((v) => Number(v || 0));
  }

  reservedQtyTx(concertId: number, options: { transaction: any; lock?: any }) {
    // Ne pas passer lock ici, car FOR UPDATE interdit sur agrégat
    const { transaction } = options;
    return ReservationModel.sum("qty", {
      where: { concertId, status: "CONFIRMED" },
      transaction,
    }).then((v) => Number(v || 0));
  }

  // Concerts avec places disponibles (remaining > 0)
  withAvailableSeats() {
    return ConcertModel.findAll({
      include: [
        { model: ArtistModel, attributes: ["id", "name"] },
        { model: StageModel, attributes: ["id", "name", "capacity"] },
        { model: ReservationModel, as: "reservations", attributes: [] },
      ],
      attributes: {
        include: [
          [fn("COALESCE", fn("SUM", col("reservations.qty")), 0), "reserved"],
          [
            literal('"max_capacity" - COALESCE(SUM(reservations.qty),0)'),
            "remaining",
          ],
        ],
      },
      having: literal('"max_capacity" - COALESCE(SUM(reservations.qty),0) > 0'),
      includeIgnoreAttributes: false,
      subQuery: false,
      group: ["ConcertModel.id", "ArtistModel.id", "StageModel.id"],
      order: [
        ["startAt", "ASC"],
        ["id", "ASC"],
      ],
    } as any);
  }
}
