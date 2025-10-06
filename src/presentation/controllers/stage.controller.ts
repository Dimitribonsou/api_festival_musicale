import type { Request, Response } from "express";
import { StageService } from "../../business/services/stage.service.js";

export class StageController {
  constructor(private svc: StageService) {}
  list = async (_: Request, res: Response) => {
    try {
      res.json(await this.svc.list());
    } catch (e: any) {
      res.status(500).json({ error: e.message || "internal error" });
    }
  };
  create = async (req: Request, res: Response) => {
    try {
      res.status(201).json(await this.svc.create(req.body));
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
      const s = await this.svc.update(+idParam, req.body);
      if (!s) return res.status(404).json({ error: "not found" });
      res.json(s);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
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
}
