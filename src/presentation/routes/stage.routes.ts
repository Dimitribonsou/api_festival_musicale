import { Router } from "express";
import { StageController } from "../controllers/stage.controller.js";
/**
 * @openapi
 * tags:
 *   - name: Stages
 *     description: Manage stages
 * /stages:
 *   get:
 *     tags: [Stages]
 *     summary: List stages
 *     responses:
 *       200: { description: List of stages }
 *   post:
 *     tags: [Stages]
 *     summary: Create a stage
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, capacity]
 *             properties:
 *               name: { type: string }
 *               capacity: { type: integer, minimum: 1 }
 *     responses:
 *       201: { description: Created }
 *       400: { description: Validation error }
 * /stages/{id}:
 *   put:
 *     tags: [Stages]
 *     summary: Update a stage
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
 *               name: { type: string }
 *               capacity: { type: integer, minimum: 1 }
 *     responses:
 *       200: { description: Updated }
 *       400: { description: Validation error }
 *       404: { description: Not found }
 *   delete:
 *     tags: [Stages]
 *     summary: Delete a stage
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
export const stageRoutes = (c: StageController) =>
  Router()
    .get("/", c.list)
    .post("/", c.create)
    .put("/:id", c.update)
    .delete("/:id", c.delete);
