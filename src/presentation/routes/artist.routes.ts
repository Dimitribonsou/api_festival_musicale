import { Router } from "express";
import { ArtistController } from "../controllers/artist.controller.js";
/**
 * @openapi
 * tags:
 *   - name: Artists
 *     description: Manage artists
 * /artists:
 *   get:
 *     tags: [Artists]
 *     summary: List artists
 *     responses:
 *       200:
 *         description: List of artists
 *   post:
 *     tags: [Artists]
 *     summary: Create an artist
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string }
 *               genre: { type: string }
 *               bioShort: { type: string }
 *               links: { type: string }
 *     responses:
 *       201:
 *         description: Created artist
 *       400:
 *         description: Validation error
 * /artists/{id}:
 *   put:
 *     tags: [Artists]
 *     summary: Update an artist
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
 *               genre: { type: string }
 *               bioShort: { type: string }
 *               links: { type: string }
 *     responses:
 *       200: { description: Updated }
 *       400: { description: Validation error }
 *       404: { description: Not found }
 *   delete:
 *     tags: [Artists]
 *     summary: Delete an artist
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
export const artistRoutes = (c: ArtistController) =>
  Router()
    .get("/", c.list)
    .post("/", c.create)
    .put("/:id", c.update)
    .delete("/:id", c.delete);
