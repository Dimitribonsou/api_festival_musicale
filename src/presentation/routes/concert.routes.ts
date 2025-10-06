import { Router } from "express";
import { ConcertController } from "../controllers/concert.controller.js";
/**
 * @openapi
 * tags:
 *   - name: Concerts
 *     description: Manage and view concerts
 * /concerts:
 *   get:
 *     tags: [Concerts]
 *     summary: List concerts with stats
 *     parameters:
 *       - in: query
 *         name: day
 *         schema: { type: string, example: "2025-10-06" }
 *       - in: query
 *         name: stageId
 *         schema: { type: integer }
 *     responses:
 *       200: { description: List with reserved/remaining }
 *   post:
 *     tags: [Concerts]
 *     summary: Create a concert
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [stageId, artistId, startAt, endAt, maxCapacity]
 *             properties:
 *               stageId: { type: integer }
 *               artistId: { type: integer }
 *               startAt: { type: string, format: date-time }
 *               endAt: { type: string, format: date-time }
 *               maxCapacity: { type: integer }
 *     responses:
 *       201: { description: Created }
 *       400: { description: Validation error }
 * /concerts/{id}:
 *   get:
 *     tags: [Concerts]
 *     summary: Get a concert with stats
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Concert details }
 *       404: { description: Not found }
 *   put:
 *     tags: [Concerts]
 *     summary: Update a concert
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stageId: { type: integer }
 *               artistId: { type: integer }
 *               startAt: { type: string, format: date-time }
 *               endAt: { type: string, format: date-time }
 *               maxCapacity: { type: integer }
 *     responses:
 *       200: { description: Updated }
 *       400: { description: Validation error }
 *       404: { description: Not found }
 *   delete:
 *     tags: [Concerts]
 *     summary: Delete a concert
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Deleted }
 *       404: { description: Not found }
 */
export const concertRoutes = (c: ConcertController) =>
  Router()
    .get("/", c.list)
    .get("/:id", c.get)
    .post("/", c.create)
    .put("/:id", c.update)
    .delete("/:id", c.delete);
