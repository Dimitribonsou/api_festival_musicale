import { Reservation, Concert, Utilisateur, sequelize } from "./model";
import { Op } from "sequelize";

export class StatsService {
    async getNombreReservations() {
        return await Reservation.count();
    }

    async getNombreUtilisateurs() {
        return await Utilisateur.count();
    }

    async getReservationsParConcert() {
        return await Reservation.findAll({
            attributes: [
                "concertId",
                [sequelize.fn("COUNT", sequelize.col("*")), "total"], // ✅ on utilise l'instance sequelize
            ],
            group: ["concertId"],
            include: [{ model: Concert, attributes: ["nom"] }], // ⚠️ ton modèle Concert n’a pas "titre" mais "nom"
        });
    }

    async getChiffreAffaires() {
        return await Reservation.sum("prix");
        // ⚠️ assure-toi que ta table Reservation a bien une colonne "prix"
    }

    async getStatsGlobales() {
        const reservations = await this.getNombreReservations();
        const utilisateurs = await this.getNombreUtilisateurs();
        const chiffreAffaires = await this.getChiffreAffaires();

        return {
            reservations,
            utilisateurs,
            chiffreAffaires,
        };
    }
}
