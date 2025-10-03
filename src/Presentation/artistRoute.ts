import { Router } from "express";
import {
    createArtist,
    getAllArtists,
    getArtistById,
    updateArtist,
    deleteArtist,
} from "../Presentation/artistController.js";

const router = Router();

router.post("/artist", createArtist); // POST /artists
router.get("/getartists", getAllArtists); // GET /artists
router.get("getartist/:id", getArtistById); // GET /artists/:id
router.put("updateartist/:id", updateArtist); // PUT /artists/:id
router.delete("deleteartist/:id", deleteArtist); // DELETE /artists/:id

export default router;
