import { Op } from "sequelize";
import { ConcertRepository } from "../../data/repositories/concert.repository.js";
import { StageRepository } from "../../data/repositories/stage.repository.js";
import { ArtistRepository } from "../../data/repositories/artist.repository.js";

export class ConcertService {
  constructor(
    private repo: ConcertRepository,
    private stages: StageRepository,
    private artists: ArtistRepository
  ) {}

  list(filters?: { day?: string; stageId?: number }) {
    // optional filters: day (YYYY-MM-DD) and/or stageId
    const where: any = {};
    if (filters?.stageId) where.stageId = filters.stageId;
    if (filters?.day) {
      const day = new Date(filters.day);
      if (isNaN(day.getTime())) throw new Error("invalid day");
      const start = new Date(
        Date.UTC(
          day.getUTCFullYear(),
          day.getUTCMonth(),
          day.getUTCDate(),
          0,
          0,
          0
        )
      );
      const end = new Date(
        Date.UTC(
          day.getUTCFullYear(),
          day.getUTCMonth(),
          day.getUTCDate(),
          23,
          59,
          59,
          999
        )
      );
      // Use Op.between to filter concerts starting within the day
      // Note: startAt < endAt is validated elsewhere
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      (where as any).startAt = { [Op.between]: [start, end] };
    }
    return this.repo.withStats(where);
  }

  details(id: number) {
    return this.repo.details(id);
  }

  async create(d: {
    stageId: number;
    artistId: number;
    startAt: string;
    endAt: string;
    maxCapacity: number;
  }) {
    // validations de base
    if (!d.stageId || !d.artistId || !d.startAt || !d.endAt)
      throw new Error("missing fields");
    const start = new Date(d.startAt),
      end = new Date(d.endAt);
    if (!(start < end)) throw new Error("invalid dates");

    // règles métier
    const stage = await this.stages.findById(d.stageId);
    if (!stage) throw new Error("invalid stageId");
    const artist = await this.artists.findById(d.artistId);
    if (!artist) throw new Error("invalid artistId");

    // Replace 'capacity' with the correct property name if different
    if (d.maxCapacity > ((stage as any).capacity ?? 0))
      throw new Error("capacity > stage capacity");

    const overlapped = await this.repo.findOverlap(d.stageId, start, end);
    if (overlapped) throw new Error("overlap on same stage");

    const c = await this.repo.create({
      stageId: d.stageId,
      artistId: d.artistId,
      startAt: start,
      endAt: end,
      maxCapacity: d.maxCapacity,
    });
    return c;
  }

  async update(
    id: number,
    d: Partial<{
      stageId: number;
      artistId: number;
      startAt: string;
      endAt: string;
      maxCapacity: number;
    }>
  ) {
    const current = await this.repo.byId(id);
    if (!current) return null;

    const stageId = d.stageId ?? current.stageId;
    const artistId = d.artistId ?? current.artistId;
    const startAt = new Date(d.startAt ?? current.startAt);
    const endAt = new Date(d.endAt ?? current.endAt);
    const maxCapacity = d.maxCapacity ?? current.maxCapacity;

    const stage = await this.stages.findById(stageId);
    if (!stage) throw new Error("invalid stageId");
    if (maxCapacity > ((stage as any).capacity ?? 0))
      throw new Error("capacity > stage capacity");

    if (!(startAt < endAt)) throw new Error("invalid dates");
    const overlapped = await this.repo.findOverlap(stageId, startAt, endAt, id);
    if (overlapped) throw new Error("overlap on same stage");

    const updated = await this.repo.update(id, {
      stageId,
      artistId,
      startAt,
      endAt,
      maxCapacity,
    });
    return updated;
  }

  remove(id: number) {
    return this.repo.delete(id);
  }

  // Programmation publique : concerts avec places disponibles
  programming() {
    return this.repo.withAvailableSeats();
  }
}
