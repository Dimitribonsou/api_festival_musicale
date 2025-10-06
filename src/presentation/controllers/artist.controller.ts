import type { Request, Response } from "express";
import { ArtistService } from "../../business/services/artist.service.js";

export class ArtistController {
  constructor(private svc: ArtistService) {}

  list = async (_: Request, res: Response) => {
    try {
      res.json(await this.svc.list());
    } catch (e: any) {
      res.status(500).json({ error: e.message || "internal error" });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const a = await this.svc.create(req.body);
      res.status(201).json(a);
    } catch (e: any) {
      // Status 409 pour les conflits (artiste déjà existant)
      const status =
        e.message.includes("already exists") || e.message.includes("unique")
          ? 409
          : 400;
      res.status(status).json({ error: e.message });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const idParam = req.params.id;
      if (typeof idParam === "undefined") {
        return res.status(400).json({ error: "id parameter is required" });
      }
      const a = await this.svc.update(+idParam, req.body);
      if (!a) return res.status(404).json({ error: "not found" });
      res.json(a);
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
