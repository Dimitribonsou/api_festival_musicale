// src/controllers/concert.controller.ts
import type { Request, Response } from "express";
import { ProgramArtisteService } from "../Metier/program-artiste.service.js";

export class ProgramArtisteController {
    static async assignArtiste(req: Request, res: Response) {
        try {
            const { concertId, artisteId } = req.body;
            if (!concertId || !artisteId) {
                return res.status(400).json({ message: "❌ concertId et artisteId requis." });
            }
            const result = await ProgramArtisteService.assignArtisteToConcert(concertId, artisteId);
            res.json(result);
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    }

    static async getAll(req: Request, res: Response) {
        try {
            const concerts = await ProgramArtisteService.getAllAssignments();
            res.json(concerts);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getOne(req: Request, res: Response) {
        try {
            const concertId = parseInt(req.params.concertId!);
            const concert = await ProgramArtisteService.getConcertArtiste(concertId);
            res.json(concert);
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    }

    static async updateArtiste(req: Request, res: Response) {
        try {
            const concertId = parseInt(req.params.concertId!);
            const { artisteId } = req.body;
            if (!artisteId) return res.status(400).json({ message: "❌ artisteId requis." });

            const result = await ProgramArtisteService.updateArtiste(concertId, artisteId);
            res.json(result);
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    }

    static async deleteAssignment(req: Request, res: Response) {
        try {
            const concertId = parseInt(req.params.concertId!);
            const result = await ProgramArtisteService.deleteArtisteAssignment(concertId);
            res.json(result);
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    }
}
