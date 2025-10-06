import type { Request, Response } from "express";
import { ReportService } from "../../business/services/report.service.js";

export class ReportController {
  constructor(private svc: ReportService) {}
  occupancy = async (_: Request, res: Response) => {
    try {
      res.json(await this.svc.occupancy());
    } catch (e: any) {
      res.status(500).json({ error: e.message || "internal error" });
    }
  };
  top = async (req: Request, res: Response) => {
    try {
      res.json(await this.svc.top(Number(req.query.limit || 5)));
    } catch (e: any) {
      res.status(500).json({ error: e.message || "internal error" });
    }
  };
  byDay = async (_: Request, res: Response) => {
    try {
      res.json(await this.svc.byDay());
    } catch (e: any) {
      res.status(500).json({ error: e.message || "internal error" });
    }
  };
}
