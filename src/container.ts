import { ArtistRepository } from "./data/repositories/artist.repository.js";
import { StageRepository } from "./data/repositories/stage.repository.js";
import { ConcertRepository } from "./data/repositories/concert.repository.js";
import { ReservationRepository } from "./data/repositories/reservation.repository.js";
import { ReportRepository } from "./data/repositories/report.repository.js";
import { ParameterRepository } from "./data/repositories/parameter.repository.js";
import { UserRepository } from "./data/repositories/user.repository.js";

import { ArtistService } from "./business/services/artist.service.js";
import { StageService } from "./business/services/stage.service.js";
import { ConcertService } from "./business/services/concert.service.js";
import { ReservationService } from "./business/services/reservation.service.js";
import { ReportService } from "./business/services/report.service.js";
import { AuthService } from "./business/services/auth.service.js";

import { ArtistController } from "./presentation/controllers/artist.controller.js";
import { StageController } from "./presentation/controllers/stage.controller.js";
import { ConcertController } from "./presentation/controllers/concert.controller.js";
import { ReservationController } from "./presentation/controllers/reservation.controller.js";
import { ReportController } from "./presentation/controllers/report.controller.js";
import { AuthController } from "./presentation/controllers/auth.controller.js";
import { ParameterController } from "./presentation/controllers/parameter.controller.js";

export function buildContainer() {
  // repositories
  const artistRepo = new ArtistRepository();
  const stageRepo = new StageRepository();
  const concertRepo = new ConcertRepository();
  const reservationRepo = new ReservationRepository();
  const reportRepo = new ReportRepository();
  const parameterRepo = new ParameterRepository();
  const userRepo = new UserRepository();

  // services (business rules)
  const artistService = new ArtistService(artistRepo);
  const stageService = new StageService(stageRepo);
  const concertService = new ConcertService(concertRepo, stageRepo, artistRepo);
  const reservationService = new ReservationService(
    reservationRepo,
    concertRepo,
    parameterRepo
  );
  const reportService = new ReportService(reportRepo);
  const authService = new AuthService(userRepo);

  // controllers (presentation)
  const artistController = new ArtistController(artistService);
  const stageController = new StageController(stageService);
  const concertController = new ConcertController(concertService);
  const reservationController = new ReservationController(reservationService);
  const reportController = new ReportController(reportService);
  const authController = new AuthController(authService);
  const parameterController = new ParameterController(parameterRepo);

  return {
    // expose façade
    artistController,
    stageController,
    concertController,
    reservationController,
    reportController,
    authController,
    parameterController,

    // si tu veux aussi exposer les services :
    artistService,
    stageService,
    concertService,
    reservationService,
    reportService,
    parameterRepo,
    authService,
    userRepo,
  };
}
