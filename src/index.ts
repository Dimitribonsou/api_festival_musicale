import type { Request, Response } from "express";
import express from "express";
import dotenv from "dotenv";
import sequelize from "./Données/database.js"; // ton instance Sequelize



dotenv.config();
const app = express();
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello API avec festival musicale !" });
});







// Fonction pour lancer la base + serveur
async function startServer() {
  try {
    // Test de connexion
    await sequelize.authenticate();
    console.log("✅ Connexion à la base réussie !");

    // Synchronisation des tables
    await sequelize.sync({ alter: true }); 
    // alter: true => adapte les tables si besoin (dev uniquement)
    // force: true => recrée toutes les tables (⚠️ détruit les données)

    console.log("📦 Base synchronisée avec Sequelize");

    // Lancer le serveur
    app.listen(3000, () => {
      console.log("🚀 Serveur démarré sur http://localhost:3000");
    });
  } catch (error) {
    console.error("❌ Impossible de démarrer la base :", error);
    process.exit(1); // arrête le process si erreur critique
  }
}

// Exécuter la fonction
startServer();

// app.listen(PORT, () => {
//   console.log(`🚀 Serveur utilisant l'architecture 3-tiers démarré sur http://localhost:${PORT}`);
// });


