import type { Request, Response } from "express";
import { ReservationService } from "../../business/services/reservation.service.js";

export class ReservationController {
  constructor(private svc: ReservationService) {}

  list = async (req: Request, res: Response) => {
    try {
      const email = req.query.email as string | undefined;
      if (email) return res.json(await this.svc.forEmail(email));
      return res.json(await this.svc.list());
    } catch (e: any) {
      res.status(500).json({ error: e.message || "internal error" });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const r = await this.svc.create(req.body);
      if (!r) {
        return res
          .status(400)
          .json({ error: "Reservation could not be created" });
      }
      console.info("reservation.created", {
        id: r.id,
        email: r.email,
        concertId: r.concertId,
        qty: r.qty,
      });
      res.status(201).json(r);
    } catch (e: any) {
      const msg = String(e.message);
      const code = /not enough seats|email already/.test(msg) ? 400 : 400;
      res.status(code).json({ error: msg });
    }
  };

  get = async (req: Request, res: Response) => {
    try {
      const idParam = req.params.id;
      if (typeof idParam === "undefined") {
        return res.status(400).json({ error: "Missing reservation id" });
      }
      const r = await this.svc.get(+idParam);
      if (!r) return res.status(404).json({ error: "not found" });
      res.json(r);
    } catch (e: any) {
      res.status(500).json({ error: e.message || "internal error" });
    }
  };

  cancel = async (req: Request, res: Response) => {
    try {
      const idParam = req.params.id;
      if (typeof idParam === "undefined") {
        return res.status(400).json({ error: "Missing reservation id" });
      }
      const r = await this.svc.cancel(+idParam);
      if (!r) return res.status(404).json({ error: "not found" });
      console.info("reservation.cancelled", { id: +idParam });
      res.json(r);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  };
}
