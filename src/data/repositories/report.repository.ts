import { col, fn, literal } from "sequelize";
import { ConcertModel } from "../models/concert.model.js";
import { ReservationModel } from "../models/reservation.model.js";
import { StageModel } from "../models/stage.model.js";
import { ArtistModel } from "../models/artist.model.js";

export class ReportRepository {
  occupancy() {
    return ConcertModel.findAll({
      attributes: [
        "id",
        "startAt",
        "endAt",
        [col("artist.name"), "artist"],
        [col("stage.name"), "stage"],
        [fn("COALESCE", fn("SUM", col("reservations.qty")), 0), "reserved"],
        [
          literal('"max_capacity" - COALESCE(SUM(reservations.qty),0)'),
          "remaining",
        ],
      ],
      include: [
        { model: ArtistModel, as: "artist", attributes: [] },
        { model: StageModel, as: "stage", attributes: [] },
        { model: ReservationModel, as: "reservations", attributes: [] },
      ],
      group: ["ConcertModel.id", "artist.name", "stage.name"],
      order: [["startAt", "ASC"]],
    });
  }

  top(limit = 5) {
    return ConcertModel.findAll({
      attributes: [
        "id",
        [col("artist.name"), "artist"],
        [
          fn(
            "COALESCE",
            fn(
              "SUM",
              literal(
                'CASE WHEN "reservations"."status" = \'CONFIRMED\' THEN "reservations"."qty" ELSE 0 END'
              )
            ),
            0
          ),
          "reserved",
        ],
      ],
      include: [
        { model: ArtistModel, as: "artist", attributes: [] },
        { model: ReservationModel, as: "reservations", attributes: [] },
      ],
      group: ["ConcertModel.id", "artist.name"],
      order: [[literal("reserved"), "DESC"]],
      limit,
    });
  }

  byDay() {
    return ConcertModel.findAll({
      attributes: [
        [fn("DATE", col("start_at")), "day"],
        [fn("COUNT", col("ConcertModel.id")), "concerts"],
        [fn("SUM", col("max_capacity")), "total_capacity"],
        [
          fn("COALESCE", fn("SUM", col("reservations.qty")), 0),
          "total_reserved",
        ],
        [
          fn(
            "ROUND",
            fn(
              "*",
              100.0,
              fn(
                "/",
                fn("COALESCE", fn("SUM", col("reservations.qty")), 0),
                fn("NULLIF", fn("SUM", col("max_capacity")), 0)
              )
            ),
            2
          ),
          "fill_rate",
        ],
        [
          fn(
            "SUM",
            literal(
              'CASE WHEN "ConcertModel"."max_capacity" - COALESCE((SELECT SUM("qty") FROM "reservations" AS "reservations" WHERE "reservations"."concertId" = "ConcertModel"."id" AND "reservations"."status" = \'CONFIRMED\'),0)=0 THEN 1 ELSE 0 END'
            )
          ),
          "sold_out",
        ],
      ],
      include: [
        { model: ReservationModel, as: "reservations", attributes: [] },
      ],
      group: [fn("DATE", col("startAt"))],
      order: [[literal("day"), "ASC"]],
    });
  }

  // KPIs globaux de remplissage
  fillRate() {
    return ConcertModel.findOne({
      attributes: [
        [fn("COUNT", "*"), "concerts"],
        [fn("SUM", col("max_capacity")), "total_capacity"],
        [
          fn("COALESCE", fn("SUM", col("reservations.qty")), 0),
          "total_reserved",
        ],
        [
          fn(
            "ROUND",
            fn(
              "*",
              100.0,
              fn(
                "/",
                fn("COALESCE", fn("SUM", col("reservations.qty")), 0),
                fn("NULLIF", fn("SUM", col("max_capacity")), 0)
              )
            ),
            2
          ),
          "overall_fill_rate",
        ],
        [
          fn(
            "SUM",
            literal(
              'CASE WHEN "ConcertModel"."max_capacity" - COALESCE((SELECT SUM("qty") FROM "reservations" AS "reservations" WHERE "reservations"."concertId" = "ConcertModel"."id" AND "reservations"."status" = \'CONFIRMED\'),0)=0 THEN 1 ELSE 0 END'
            )
          ),
          "sold_out",
        ],
      ],
      include: [
        { model: ReservationModel, as: "reservations", attributes: [] },
      ],
      raw: true,
    });
  }

  // Performance par artiste
  byArtist() {
    return ArtistModel.findAll({
      attributes: [
        [col("ArtistModel.id"), "artist_id"],
        [col("ArtistModel.name"), "artist"],
        [fn("COUNT", col("Concerts.id")), "concerts"],
        [
          fn("COALESCE", fn("SUM", col("Concerts.max_capacity")), 0),
          "capacity",
        ],
        [
          fn("COALESCE", fn("SUM", col("Concerts.Reservations.qty")), 0),
          "reserved",
        ],
        [
          fn(
            "ROUND",
            fn(
              "*",
              100.0,
              fn(
                "/",
                fn("COALESCE", fn("SUM", col("Concerts.Reservations.qty")), 0),
                fn("NULLIF", fn("SUM", col("Concerts.max_capacity")), 0)
              )
            ),
            2
          ),
          "fill_rate",
        ],
      ],
      include: [
        {
          model: ConcertModel,
          as: "Concerts",
          attributes: [],
          include: [
            {
              model: ReservationModel,
              as: "reservations",
              attributes: [],
            },
          ],
        },
      ],
      group: ["ArtistModel.id"],
      order: [
        [literal("fill_rate"), "DESC NULLS LAST"],
        [literal("reserved"), "DESC"],
        [literal("capacity"), "DESC"],
        [col("ArtistModel.name"), "ASC"],
      ],
    });
  }

  // Total des réservations
  totalReservations() {
    return ReservationModel.findOne({
      attributes: [[fn("COALESCE", fn("SUM", col("qty")), 0), "total"]],
      raw: true,
    });
  }
}
