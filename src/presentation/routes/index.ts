import { Router } from "express";
import { artistRoutes } from "./artist.routes.js";
import { stageRoutes } from "./stage.routes.js";
import { concertRoutes } from "./concert.routes.js";
import { reservationRoutes } from "./reservation.routes.js";
import { reportRoutes } from "./report.routes.js";
import { authRoutes } from "./auth.routes.js";
import { programmingRoutes } from "./programming.routes.js";
import { requireAuth, requireOrganizer } from "../middlewares/auth.js";
import { parameterRoutes } from "./parameter.routes.js";

export const buildRouter = (app: any) => {
  const r = Router();
  const s = app.locals.services;

  r.use("/artists", artistRoutes(s.artistController));
  r.use("/stages", stageRoutes(s.stageController));
  r.use("/concerts", concertRoutes(s.concertController));
  r.use("/programming", programmingRoutes(s.concertController));
  r.use("/reservations", reservationRoutes(s.reservationController));
  r.use("/reports", reportRoutes(s.reportController));
  r.use("/auth", authRoutes(s.authController));
  r.use("/parameters", parameterRoutes(s.parameterController));

  // Protect admin operations (organisateur):
  // Here, we wrap the routers: better is to protect within each router, but for simplicity we add middlewares after base paths.
  // Artists admin
  r.post("/artists", requireAuth, requireOrganizer, (req, res, next) => next());
  r.put("/artists/:id", requireAuth, requireOrganizer, (req, res, next) =>
    next()
  );
  r.delete("/artists/:id", requireAuth, requireOrganizer, (req, res, next) =>
    next()
  );
  // Stages admin
  r.post("/stages", requireAuth, requireOrganizer, (req, res, next) => next());
  r.put("/stages/:id", requireAuth, requireOrganizer, (req, res, next) =>
    next()
  );
  r.delete("/stages/:id", requireAuth, requireOrganizer, (req, res, next) =>
    next()
  );
  // Concerts admin
  r.post("/concerts", requireAuth, requireOrganizer, (req, res, next) =>
    next()
  );
  r.put("/concerts/:id", requireAuth, requireOrganizer, (req, res, next) =>
    next()
  );
  r.delete("/concerts/:id", requireAuth, requireOrganizer, (req, res, next) =>
    next()
  );

  return r;
};
