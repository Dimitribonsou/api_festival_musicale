import { Concert } from "../Metier/model.js";
import { Artiste } from "../Metier/model.js";

export class ProgramArtisteService {
    // Affecter un artiste à un concert
    static async assignArtisteToConcert(concertId: number, artisteId: number) {
        const concert = await Concert.findByPk(concertId);
        if (!concert) throw new Error("Concert introuvable");

        const artiste = await Artiste.findByPk(artisteId);
        if (!artiste) throw new Error("Artiste introuvable");

        (concert as any).ArtisteId = (artiste as any).Id;
        await concert.save();

        const updatedConcert = await Concert.findByPk(concertId, {
            include: [{ model: Artiste, as: "artiste" }],
        });

        return {
            message: `✅ L'artiste ${artiste.Nom} a été affecté au concert #${concert.Id}`,
            concert: updatedConcert,
        };
    }

    // Récupérer toutes les assignations
    static async getAllAssignments() {
        return await Concert.findAll({
            include: [{ model: Artiste, as: "artiste" }],
        });
    }

    // Récupérer l'artiste d'un concert
    static async getConcertArtiste(concertId: number) {
        const concert = await Concert.findByPk(concertId, {
            include: [{ model: Artiste, as: "artiste" }],
        });
        if (!concert) throw new Error("Concert introuvable");
        return concert;
    }

    // Mettre à jour l'artiste assigné à un concert
    static async updateArtiste(concertId: number, artisteId: number) {
        const concert = await Concert.findByPk(concertId);
        if (!concert) throw new Error("Concert introuvable");

        const artiste = await Artiste.findByPk(artisteId);
        if (!artiste) throw new Error("Artiste introuvable");

        (concert as any).ArtisteId = (artiste as any).Id;
        await concert.save();

        const updatedConcert = await Concert.findByPk(concertId, {
            include: [{ model: Artiste, as: "artiste" }],
        });

        return {
            message: `✅ L'artiste a été mis à jour pour le concert #${concert.Id}`,
            concert: updatedConcert,
        };
    }

    // Supprimer l'assignation artiste d'un concert
    static async deleteArtisteAssignment(concertId: number) {
        const concert = await Concert.findByPk(concertId);
        if (!concert) throw new Error("Concert introuvable");

        (concert as any).ArtisteId = null;
        await concert.save();

        return { message: `✅ L'artiste a été retiré du concert #${concert.Id}` };
    }
}
