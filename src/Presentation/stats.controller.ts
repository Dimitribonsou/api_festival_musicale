import type { Request, Response } from "express";
import { StatsService } from "../Metier/stats.service";

const service = new StatsService();

export class StatsController {
    static async getGlobales(req: Request, res: Response) {
        const stats = await service.getStatsGlobales();
        res.json(stats);
    }

    static async getParConcert(req: Request, res: Response) {
        const stats = await service.getReservationsParConcert();
        res.json(stats);
    }
}
