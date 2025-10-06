import type { Request, Response } from "express";
import { ConcertService } from "../../business/services/concert.service.js";

export class ConcertController {
  constructor(private svc: ConcertService) {}

  list = async (req: Request, res: Response) => {
    try {
      const filters: { day?: string; stageId?: number } = {};
      const qDay = req.query.day as string | undefined;
      if (qDay) filters.day = qDay;
      if (req.query.stageId) filters.stageId = Number(req.query.stageId);
      const list = await this.svc.list(filters);
      res.json(list);
    } catch (e: any) {
      res.status(500).json({ error: e.message || "internal error" });
    }
  };

  get = async (req: Request, res: Response) => {
    try {
      const idParam = req.params.id;
      if (typeof idParam === "undefined") {
        return res.status(400).json({ error: "id parameter is required" });
      }
      const c = await this.svc.details(+idParam);
      if (!c) return res.status(404).json({ error: "not found" });
      res.json(c);
    } catch (e: any) {
      res.status(500).json({ error: e.message || "internal error" });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const c = await this.svc.create(req.body);
      res.status(201).json(c);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const idParam = req.params.id;
      if (typeof idParam === "undefined") {
        return res.status(400).json({ error: "id parameter is required" });
      }
      const c = await this.svc.update(+idParam, req.body);
      if (!c) return res.status(404).json({ error: "not found" });
      res.json(c);
    } catch (e: any) {
      res.status(500).json({ error: e.message || "internal error" });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const idParam = req.params.id;
      if (typeof idParam === "undefined") {
        return res.status(400).json({ error: "id parameter is required" });
      }
      const n = await this.svc.remove(+idParam);
      if (!n) return res.status(404).json({ error: "not found" });
      res.status(204).end();
    } catch (e: any) {
      res.status(500).json({ error: e.message || "internal error" });
    }
  };

  programming = async (_: Request, res: Response) => {
    try {
      const concerts = await this.svc.programming();
      res.json(concerts);
    } catch (e: any) {
      res.status(500).json({ error: e.message || "internal error" });
    }
  };
}
