import { Router } from "express";
import { ReportController } from "../controllers/report.controller.js";
/**
 * @openapi
 * tags:
 *   - name: Reports
 *     description: Simple reports
 * /reports/occupancy:
 *   get:
 *     tags: [Reports]
 *     summary: Occupancy per concert (reserved, remaining)
 *     responses:
 *       200: { description: Report }
 * /reports/top:
 *   get:
 *     tags: [Reports]
 *     summary: Top concerts by reservations
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 5 }
 *     responses:
 *       200: { description: Report }
 * /reports/by-day:
 *   get:
 *     tags: [Reports]
 *     summary: Summary per day (concerts, total capacity, reserved, sold out count)
 *     responses:
 *       200: { description: Report }
 */
export const reportRoutes = (c: ReportController) =>
  Router()
    .get("/occupancy", c.occupancy)
    .get("/top", c.top)
    .get("/by-day", c.byDay);
