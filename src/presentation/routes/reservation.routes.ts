import { Router } from "express";
import { ReservationController } from "../controllers/reservation.controller.js";
/**
 * @openapi
 * tags:
 *   - name: Reservations
 *     description: Manage reservations
 * /reservations:
 *   get:
 *     tags: [Reservations]
 *     summary: List reservations
 *     parameters:
 *       - in: query
 *         name: email
 *         schema: { type: string }
 *     responses:
 *       200: { description: List of reservations }
 *   post:
 *     tags: [Reservations]
 *     summary: Create a reservation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [concertId, email, qty]
 *             properties:
 *               concertId: { type: integer }
 *               email: { type: string }
 *               qty: { type: integer, minimum: 1 }
 *     responses:
 *       201: { description: Created }
 *       400: { description: Validation/capacity errors }
 * /reservations/{id}:
 *   get:
 *     tags: [Reservations]
 *     summary: Get a reservation by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Reservation }
 *       404: { description: Not found }
 *   delete:
 *     tags: [Reservations]
 *     summary: Cancel a reservation
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Cancelled }
 *       400: { description: Deadline passed }
 *       404: { description: Not found }
 */
export const reservationRoutes = (c: ReservationController) =>
  Router()
    .get("/", c.list)
    .get("/:id", c.get)
    .post("/", c.create)
    .delete("/:id", c.cancel); // annulation
