import { Router } from "express";
import { ParameterController } from "../controllers/parameter.controller.js";
import { requireAuth, requireOrganizer } from "../middlewares/auth.js";

export const parameterRoutes = (c: ParameterController) =>
  Router()
    .get("/:key", c.get)
    .put("/:key", requireAuth, requireOrganizer, c.set);
