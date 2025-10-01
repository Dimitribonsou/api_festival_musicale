import type { Request, Response } from "express";
import {Artiste} from "../Metier/model";

// CREATE
export const createArtist = async (req: Request, res: Response) => {
  try {
    // Récupérer les données de l'artiste à partir du corps de la requête
    const { nom, genre, bioCourte, liens } = req.body;
    // Créer un nouvel artiste
    const artist = await Artiste.create({ nom, genre,bioCourte,liens });
    // Retourner l'artiste créé
    res.status(201).json(artist);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la création de l'artiste" });
  }
};

// READ (all)
export const getAllArtists = async (req: Request, res: Response) => {
  try {
    // Trouver tous les artistes
    const artists = await Artiste.findAll();
    // Retourner la liste des artistes
    res.json(artists);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des artistes" });
  }
};

// READ (one)
export const getArtistById = async (req: Request, res: Response) => {
  try {
    // Récupérer l'ID de l'artiste à partir des paramètres de la requête
    const { id } = req.params;
    // Trouver l'artiste par son ID
    const artist = await Artiste.findByPk(id);
    if (!artist) return res.status(404).json({ error: "Artiste introuvable" });
    // Retourner l'artiste trouvé
    res.json(artist);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération de l'artiste" });
  }
};

// UPDATE
export const updateArtist = async (req: Request, res: Response) => {
  try {
    // Récupérer l'ID de l'artiste à partir des paramètres de la requête
    const { id } = req.params;
    // Récupérer les nouvelles données de l'artiste à partir du corps de la requête
    const { nom, genre,bioCourte, liens} = req.body;
    // Trouver l'artiste par son ID
    const artist = await Artiste.findByPk(id);
    if (!artist) return res.status(404).json({ error: "Artiste introuvable" });
//MODIFIER LES PROPRIETES AVEC LES NOUVELLES VALEURS
    artist.set("Nom", nom) ;
    artist.set("Genre", genre) ;
    artist.set("BioCourte", bioCourte) ;
    artist.set("Liens", liens) ;
  //enregistrer les modifications
    await artist.save();
//RETOURNER L'ARTISTE MODIFIE
    res.json(artist);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la mise à jour de l'artiste" });
  }
};

// DELETE
export const deleteArtist = async (req: Request, res: Response) => {
  try {
    // Récupérer l'ID de l'artiste à partir des paramètres de la requête
    const { id } = req.params;
    // Trouver l'artiste par son ID
    const artist = await Artiste.findByPk(id);
    if (!artist) return res.status(404).json({ error: "Artiste introuvable" });
//supprimer l'artiste
    await artist.destroy();
//retourner un message de succès
    res.json({ message: "Artiste supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la suppression de l'artiste" });
  }
};
