import { Router } from "express";
import type { ConcertController } from "../controllers/concert.controller.js";

export const programmingRoutes = (controller: ConcertController) => {
  const router = Router();

  /**
   * @swagger
   * /programming:
   *   get:
   *     summary: Consulter la programmation publique (concerts avec places disponibles)
   *     tags: [Programming]
   *     responses:
   *       200:
   *         description: Liste des concerts avec places disponibles
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: integer
   *                   artist:
   *                     type: string
   *                   startAt:
   *                     type: string
   *                     format: date-time
   *                   endAt:
   *                     type: string
   *                     format: date-time
   *                   maxCapacity:
   *                     type: integer
   *                   reserved:
   *                     type: integer
   *                   remaining:
   *                     type: integer
   *       500:
   *         description: Erreur interne
   */
  router.get("/", controller.programming);

  return router;
};
