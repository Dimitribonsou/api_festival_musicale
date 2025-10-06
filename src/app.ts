import express from "express";
import "./data/models/artist.model.js";
import "./data/models/stage.model.js";
import "./data/models/concert.model.js";
import "./data/models/reservation.model.js";
import "./data/models/parameter.model.js";

import { buildContainer } from "./container.js";
import { buildRouter } from "./presentation/routes/index.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger.config.js";

export function createApp() {
  const app = express();
  app.use(express.json());

  // façade : services/controllers accessibles pour les routes & middlewares
  app.locals.services = buildContainer();

  // routes (presentation)
  app.use("/", buildRouter(app));

  // docs
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // simple health
  app.get("/health", (_req, res) => res.json({ ok: true }));

  // errors
  app.use((err: any, _req: any, res: any, _next: any) => {
    console.error(err);
    res.status(500).json({ error: "internal error" });
  });

  return app;
}
