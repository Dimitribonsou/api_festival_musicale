import { Router } from "express";
import { ProgramArtisteController } from "../Presentation/program-artisteController.js"

const router = Router();

// POST /concerts/assign-artiste
router.post("/concerts/assign-artiste", ProgramArtisteController.assignArtiste);

// GET : Récupérer toutes les assignations
router.get("/concerts/artistes", ProgramArtisteController.getAll);

// GET : Récupérer l'artiste d'un concert spécifique
router.get("/concerts/:concertId/artiste", ProgramArtisteController.getOne);

// PUT : Mettre à jour l'artiste assigné à un concert
router.put("/concerts/:concertId/assign-artiste", ProgramArtisteController.updateArtiste);

// DELETE : Supprimer l'assignation artiste d'un concert
router.delete("/concerts/:concertId/assign-artiste", ProgramArtisteController.deleteAssignment);

export default router;

