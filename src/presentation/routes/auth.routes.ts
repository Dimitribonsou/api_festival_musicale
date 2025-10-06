import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user (PUBLIC role by default)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [PUBLIC, ORGANISATEUR]
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Invalid data
 * /auth/login:
 *   post:
 *     summary: Login and receive a JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 */

export const authRoutes = (c: AuthController) =>
  Router().post("/register", c.register).post("/login", c.login);
