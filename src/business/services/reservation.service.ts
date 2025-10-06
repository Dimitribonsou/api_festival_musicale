import { ConcertRepository } from "../../data/repositories/concert.repository.js";
import { ReservationRepository } from "../../data/repositories/reservation.repository.js";
import { ParameterRepository } from "../../data/repositories/parameter.repository.js";
import { sequelize } from "../../data/sequelize.js";
import { ConcertModel } from "../../data/models/concert.model.js";

export class ReservationService {
  constructor(
    private repo: ReservationRepository,
    private concerts: ConcertRepository,
    private params: ParameterRepository
  ) {}

  list() {
    return this.repo.list();
  }
  forEmail(email: string) {
    return this.repo.forEmail(email);
  }

  get(id: number) {
    return this.repo.byId(id);
  }

  async create(d: { concertId: number; email: string; qty: number }) {
    if (!d.concertId || !d.email?.trim() || !d.qty || d.qty < 1)
      throw new Error("invalid data");

    return sequelize.transaction(async (t) => {
      // Lock the concert row to avoid concurrent overbooking
      const concert = await ConcertModel.findByPk(d.concertId, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (!concert) throw new Error("invalid concertId");

      // Unique email per concert
      const dup = await this.repo.findDuplicate(
        d.concertId,
        d.email.trim().toLowerCase()
      );
      if (dup) throw new Error("email already reserved for this concert");

      // Remaining capacity inside transaction
      const reserved = await this.concerts.reservedQtyTx(d.concertId, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      const remaining = (concert as any).maxCapacity - reserved;
      if (d.qty > remaining) throw new Error("not enough seats");

      return this.repo.create(
        {
          concertId: d.concertId,
          email: d.email.trim().toLowerCase(),
          qty: d.qty,
          status: "CONFIRMED",
        } as any,
        { transaction: t }
      );
    });
  }

  async cancel(id: number) {
    const r = await this.repo.byId(id);
    if (!r) return null;

    const cfg =
      (await this.params.getNumber("CANCEL_DEADLINE_HOURS")) ??
      Number(process.env.CANCEL_DEADLINE_HOURS || 24);
    const deadlineHours = Number.isFinite(cfg) ? Number(cfg) : 24;
    const start = (await this.concerts.byId(r.concertId))!
      .startAt as unknown as Date;
    const limit = new Date(start.getTime() - deadlineHours * 3600 * 1000);
    if (new Date() > limit) throw new Error("cancellation deadline passed");

    await this.repo.cancel(id);
    return { ok: true };
  }
}
