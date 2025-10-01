import express from 'express';
import type { Request, Response } from 'express';
import Database from 'better-sqlite3';
import type { RunResult } from 'better-sqlite3';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger.config.ts';

// --- DB & App ------------------------------------------------------------------------------------
const db = new Database(process.env.DB_PATH || 'festival.db');
const app = express();
app.use(express.json());

// --- Swagger Documentation ----------------------------------------------------------------------
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  swaggerOptions: {
    persistAuthorization: true,
  },
}));

// Route pour accéder au JSON de la spécification OpenAPI
app.get('/api-docs.json', (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// --- Types ---------------------------------------------------------------------------------------
interface Artist { id: number; name: string }
interface Concert { id: number; artist_id: number; starts_at: string; capacity: number }
interface Reservation { id: number; concert_id: number; email: string; qty: number }
interface ConcertStats {
  id: number;
  artist: string;
  starts_at: string; // ISO string
  capacity: number;
  reserved: number;
  remaining: number;
  fill_rate: number | null; // %
}

// --- Schema --------------------------------------------------------------------------------------
db.exec(`
PRAGMA foreign_keys=ON;
CREATE TABLE IF NOT EXISTS artists(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS concerts(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  artist_id INTEGER NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  starts_at TEXT NOT NULL,
  capacity INTEGER NOT NULL CHECK(capacity >= 0)
);
CREATE TABLE IF NOT EXISTS reservations(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  concert_id INTEGER NOT NULL REFERENCES concerts(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  qty INTEGER NOT NULL CHECK(qty > 0),
  UNIQUE(concert_id, email)
);
`);

// --- Helpers -------------------------------------------------------------------------------------
const row = <T = any>(sql: string, p: any[] = []): T | undefined => db.prepare(sql).get(p) as T | undefined;
const all = <T = any>(sql: string, p: any[] = []): T[] => db.prepare(sql).all(p) as T[];
const run = (sql: string, p: any[] = []): RunResult => db.prepare(sql).run(p);
const withTx = <R>(fn: () => R) => db.transaction(fn);

// --- Requêtes réutilisables ----------------------------------------------------------------------
const concertStatsBase = `
SELECT c.id, a.name AS artist, c.starts_at, c.capacity,
       COALESCE(SUM(r.qty),0) AS reserved,
       (c.capacity - COALESCE(SUM(r.qty),0)) AS remaining,
       ROUND(100.0 * COALESCE(SUM(r.qty),0) / NULLIF(c.capacity,0), 2) AS fill_rate
FROM concerts c
JOIN artists a ON a.id = c.artist_id
LEFT JOIN reservations r ON r.concert_id = c.id
GROUP BY c.id
`;

const concertStatsOrdered = `${concertStatsBase}
ORDER BY c.starts_at ASC, c.id ASC`;

// --- Artists CRUD --------------------------------------------------------------------------------

/**
 * @swagger
 * /artists:
 *   get:
 *     tags:
 *       - Artists
 *     summary: Récupérer tous les artistes
 *     description: Retourne la liste de tous les artistes triés par nom
 *     responses:
 *       200:
 *         description: Liste des artistes récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Artist'
 */
app.get('/artists', (_req: Request, res: Response) => {
  const rows = all<Artist>(`SELECT * FROM artists ORDER BY name ASC`);
  res.json(rows);
});

/**
 * @swagger
 * /artists:
 *   post:
 *     tags:
 *       - Artists
 *     summary: Créer un nouvel artiste
 *     description: Ajoute un nouvel artiste à la base de données
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nom de l'artiste
 *                 example: "The Beatles"
 *     responses:
 *       201:
 *         description: Artiste créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Artist'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       409:
 *         $ref: '#/components/responses/Conflict'
 */
app.post('/artists', (req: Request, res: Response) => {
  const { name } = (req.body ?? {}) as Partial<Artist>;
  if (!name || !name.trim()) return res.status(400).json({ error: 'name required' });
  try {
    const { lastInsertRowid } = run(`INSERT INTO artists(name) VALUES(?)`, [name.trim()]);
    const created = row<Artist>(`SELECT * FROM artists WHERE id=?`, [lastInsertRowid]);
    return res.status(201).json(created);
  } catch {
    return res.status(409).json({ error: 'artist already exists' });
  }
});

/**
 * @swagger
 * /artists/{id}:
 *   put:
 *     tags:
 *       - Artists
 *     summary: Mettre à jour un artiste
 *     description: Met à jour les informations d'un artiste existant
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant de l'artiste
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nouveau nom de l'artiste
 *                 example: "The Rolling Stones"
 *     responses:
 *       200:
 *         description: Artiste mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Artist'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
app.put('/artists/:id', (req: Request, res: Response) => {
  const { name } = (req.body ?? {}) as Partial<Artist>;
  if (!name || !name.trim()) return res.status(400).json({ error: 'name required' });
  const r = run(`UPDATE artists SET name=? WHERE id=?`, [name.trim(), Number(req.params.id)]);
  if (!r.changes) return res.status(404).json({ error: 'not found' });
  const updated = row<Artist>(`SELECT * FROM artists WHERE id=?`, [Number(req.params.id)]);
  return res.json(updated);
});

/**
 * @swagger
 * /artists/{id}:
 *   delete:
 *     tags:
 *       - Artists
 *     summary: Supprimer un artiste
 *     description: Supprime un artiste et tous ses concerts associés
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant de l'artiste
 *     responses:
 *       204:
 *         description: Artiste supprimé avec succès
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
app.delete('/artists/:id', (req: Request, res: Response) => {
  const r = run(`DELETE FROM artists WHERE id=?`, [Number(req.params.id)]);
  if (!r.changes) return res.status(404).json({ error: 'not found' });
  return res.status(204).end();
});

// --- Concerts CRUD -------------------------------------------------------------------------------

/**
 * @swagger
 * /concerts:
 *   get:
 *     tags:
 *       - Concerts
 *     summary: Récupérer tous les concerts avec statistiques
 *     description: Retourne la liste de tous les concerts avec leurs statistiques de réservation
 *     responses:
 *       200:
 *         description: Liste des concerts récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ConcertStats'
 */
app.get('/concerts', (_req: Request, res: Response) => {
  const rows = all<ConcertStats>(concertStatsOrdered);
  res.json(rows);
});

/**
 * @swagger
 * /concerts:
 *   post:
 *     tags:
 *       - Concerts
 *     summary: Créer un nouveau concert
 *     description: Ajoute un nouveau concert à la programmation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - artist_id
 *               - starts_at
 *               - capacity
 *             properties:
 *               artist_id:
 *                 type: integer
 *                 description: Identifiant de l'artiste
 *                 example: 1
 *               starts_at:
 *                 type: string
 *                 format: date-time
 *                 description: Date et heure de début du concert
 *                 example: "2025-07-15T20:00:00Z"
 *               capacity:
 *                 type: integer
 *                 minimum: 0
 *                 description: Capacité maximale du concert
 *                 example: 5000
 *     responses:
 *       201:
 *         description: Concert créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConcertStats'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
app.post('/concerts', (req: Request, res: Response) => {
  const { artist_id, starts_at, capacity } = (req.body ?? {}) as Partial<Concert>;
  if (artist_id == null || !starts_at || capacity == null) {
    return res.status(400).json({ error: 'artist_id, starts_at, capacity required' });
  }
  const a = row<Pick<Artist, 'id'>>(`SELECT id FROM artists WHERE id=?`, [Number(artist_id)]);
  if (!a) return res.status(400).json({ error: 'artist_id invalid' });

  const { lastInsertRowid } = run(
    `INSERT INTO concerts(artist_id, starts_at, capacity) VALUES(?,?,?)`,
    [Number(artist_id), String(starts_at), Number(capacity)]
  );
  const created = row<ConcertStats>(`SELECT * FROM (${concertStatsBase}) WHERE id=?`, [lastInsertRowid]);
  return res.status(201).json(created);
});

/**
 * @swagger
 * /concerts/{id}:
 *   put:
 *     tags:
 *       - Concerts
 *     summary: Mettre à jour un concert
 *     description: Met à jour les informations d'un concert existant
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant du concert
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               artist_id:
 *                 type: integer
 *                 description: Nouvel identifiant de l'artiste
 *                 example: 2
 *               starts_at:
 *                 type: string
 *                 format: date-time
 *                 description: Nouvelle date et heure de début
 *                 example: "2025-07-16T21:00:00Z"
 *               capacity:
 *                 type: integer
 *                 minimum: 0
 *                 description: Nouvelle capacité maximale
 *                 example: 6000
 *     responses:
 *       200:
 *         description: Concert mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConcertStats'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
app.put('/concerts/:id', (req: Request, res: Response) => {
  const { artist_id, starts_at, capacity } = (req.body ?? {}) as Partial<Concert>;
  const existing = row<Concert>(`SELECT * FROM concerts WHERE id=?`, [Number(req.params.id)]);
  if (!existing) return res.status(404).json({ error: 'not found' });

  const newArtist = artist_id ?? existing.artist_id;
  const a = row<Pick<Artist, 'id'>>(`SELECT id FROM artists WHERE id=?`, [Number(newArtist)]);
  if (!a) return res.status(400).json({ error: 'artist_id invalid' });

  run(`UPDATE concerts SET artist_id=?, starts_at=?, capacity=? WHERE id=?`, [
    Number(newArtist),
    String(starts_at ?? existing.starts_at),
    Number(capacity ?? existing.capacity),
    Number(req.params.id),
  ]);
  const updated = row<ConcertStats>(`SELECT * FROM (${concertStatsBase}) WHERE id=?`, [Number(req.params.id)]);
  return res.json(updated);
});

/**
 * @swagger
 * /concerts/{id}:
 *   delete:
 *     tags:
 *       - Concerts
 *     summary: Supprimer un concert
 *     description: Supprime un concert et toutes ses réservations associées
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant du concert
 *     responses:
 *       204:
 *         description: Concert supprimé avec succès
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
app.delete('/concerts/:id', (req: Request, res: Response) => {
  const r = run(`DELETE FROM concerts WHERE id=?`, [Number(req.params.id)]);
  if (!r.changes) return res.status(404).json({ error: 'not found' });
  return res.status(204).end();
});

// --- Programmation disponible --------------------------------------------------------------------

/**
 * @swagger
 * /programming:
 *   get:
 *     tags:
 *       - Programming
 *     summary: Récupérer la programmation disponible
 *     description: Retourne uniquement les concerts qui ont encore des places disponibles
 *     responses:
 *       200:
 *         description: Programmation disponible récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ConcertStats'
 */
app.get('/programming', (_req: Request, res: Response) => {
  const rows = all<ConcertStats>(
    `SELECT * FROM (${concertStatsBase}) WHERE remaining > 0 ORDER BY starts_at ASC, id ASC`
  );
  res.json(rows);
});

// --- Réservations --------------------------------------------------------------------------------

/**
 * @swagger
 * /reservations:
 *   get:
 *     tags:
 *       - Reservations
 *     summary: Récupérer toutes les réservations
 *     description: Retourne la liste de toutes les réservations avec les détails des concerts et artistes
 *     responses:
 *       200:
 *         description: Liste des réservations récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Identifiant de la réservation
 *                   email:
 *                     type: string
 *                     format: email
 *                     description: Email du réservant
 *                   qty:
 *                     type: integer
 *                     description: Nombre de places réservées
 *                   concert_id:
 *                     type: integer
 *                     description: Identifiant du concert
 *                   artist:
 *                     type: string
 *                     description: Nom de l'artiste
 *                   starts_at:
 *                     type: string
 *                     format: date-time
 *                     description: Date et heure du concert
 */
app.get('/reservations', (_req: Request, res: Response) => {
  const rows = all(
    `SELECT r.id, r.email, r.qty, r.concert_id, a.name AS artist, c.starts_at
       FROM reservations r
       JOIN concerts c ON c.id = r.concert_id
       JOIN artists a  ON a.id = c.artist_id
       ORDER BY c.starts_at ASC, r.id ASC`
  );
  res.json(rows);
});

/**
 * @swagger
 * /reservations:
 *   post:
 *     tags:
 *       - Reservations
 *     summary: Créer une nouvelle réservation
 *     description: Ajoute une nouvelle réservation pour un concert. Vérifie la disponibilité des places et l'unicité de l'email par concert.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - concert_id
 *               - email
 *               - qty
 *             properties:
 *               concert_id:
 *                 type: integer
 *                 description: Identifiant du concert
 *                 example: 1
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email du réservant
 *                 example: "user@example.com"
 *               qty:
 *                 type: integer
 *                 minimum: 1
 *                 description: Nombre de places à réserver
 *                 example: 2
 *     responses:
 *       201:
 *         description: Réservation créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reservation:
 *                   $ref: '#/components/schemas/Reservation'
 *                 concert:
 *                   $ref: '#/components/schemas/ConcertStats'
 *       400:
 *         description: Données invalides ou pas assez de places disponibles
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     error:
 *                       type: string
 *                       example: "concert_id, email, qty required"
 *                 - type: object
 *                   properties:
 *                     error:
 *                       type: string
 *                       example: "invalid concert_id"
 *                 - type: object
 *                   properties:
 *                     error:
 *                       type: string
 *                       example: "not enough seats"
 *       409:
 *         description: Email déjà utilisé pour ce concert
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "email already reserved for this concert"
 */
app.post('/reservations', (req: Request, res: Response) => {
  const { concert_id, email, qty } = (req.body ?? {}) as Partial<Reservation> & { concert_id?: number };
  if (concert_id == null || !email || !email.trim() || qty == null) {
    return res.status(400).json({ error: 'concert_id, email, qty required' });
  }
  const tx = withTx(() => {
    const c = row<ConcertStats>(`SELECT * FROM (${concertStatsBase}) WHERE id=?`, [Number(concert_id)]);
    if (!c) return { status: 400, json: { error: 'invalid concert_id' } } as const;

    const dup = row(`SELECT 1 FROM reservations WHERE concert_id=? AND email=?`, [
      Number(concert_id),
      email.trim().toLowerCase(),
    ]);
    if (dup) return { status: 409, json: { error: 'email already reserved for this concert' } } as const;

    if (Number(qty) > Number(c.remaining)) {
      return { status: 400, json: { error: 'not enough seats' } } as const;
    }

    const { lastInsertRowid } = run(
      `INSERT INTO reservations(concert_id,email,qty) VALUES(?,?,?)`,
      [Number(concert_id), email.trim().toLowerCase(), Number(qty)]
    );

    const created = row<Reservation>(`SELECT id, concert_id, email, qty FROM reservations WHERE id=?`, [lastInsertRowid]);
    const stats = row<ConcertStats>(`SELECT * FROM (${concertStatsBase}) WHERE id=?`, [Number(concert_id)]);
    return { status: 201, json: { reservation: created, concert: stats } } as const;
  });

  const out = tx();
  res.status(out.status).json(out.json);
});

// --- Rapports ------------------------------------------------------------------------------------
// A) KPIs globaux de remplissage
/**
 * @swagger
 * /reports/fill-rate:
 *   get:
 *     tags:
 *       - Reports
 *     summary: KPIs globaux de remplissage
 *     description: Retourne des statistiques globales de remplissage pour l'ensemble des concerts
 *     responses:
 *       200:
 *         description: Statistiques de remplissage globales
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FillRateReport'
 */
app.get('/reports/fill-rate', (_req: Request, res: Response) => {
  const summary = row(
    `SELECT
      COUNT(*) AS concerts,
      SUM(capacity) AS total_capacity,
      SUM(reserved) AS total_reserved,
      ROUND(100.0 * SUM(reserved) / NULLIF(SUM(capacity), 0), 2) AS overall_fill_rate,
      SUM(CASE WHEN remaining = 0 THEN 1 ELSE 0 END) AS sold_out,
      MIN(fill_rate) AS min_fill_rate,
      MAX(fill_rate) AS max_fill_rate,
      ROUND(AVG(fill_rate), 2) AS avg_fill_rate
     FROM (${concertStatsBase})`
  );
  res.json(summary ?? {});
});

// B) Performance par artiste (NOTE: SQLite ne supporte pas "NULLS LAST")
/**
 * @swagger
 * /reports/by-artist:
 *   get:
 *     tags:
 *       - Reports
 *     summary: Performance des concerts par artiste
 *     description: Retourne, pour chaque artiste, le nombre de concerts, la capacité totale, le total des réservations et le taux de remplissage
 *     responses:
 *       200:
 *         description: Liste des performances par artiste
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ReportByArtistItem'
 */
app.get('/reports/by-artist', (_req: Request, res: Response) => {
  const sql = `
    SELECT
      a.id AS artist_id,
      a.name AS artist,
      COUNT(c.id) AS concerts,
      COALESCE(SUM(c.capacity),0) AS capacity,
      COALESCE(SUM(r.qty),0) AS reserved,
      ROUND(100.0 * COALESCE(SUM(r.qty),0) / NULLIF(SUM(c.capacity),0), 2) AS fill_rate
    FROM artists a
    LEFT JOIN concerts c ON c.artist_id = a.id
    LEFT JOIN reservations r ON r.concert_id = c.id
    GROUP BY a.id
    ORDER BY (fill_rate IS NULL) ASC, fill_rate DESC, reserved DESC, capacity DESC, artist ASC`;
  res.json(all(sql));
});

// C) Remplissage par jour
/**
 * @swagger
 * /reports/by-day:
 *   get:
 *     tags:
 *       - Reports
 *     summary: Remplissage agrégé par jour
 *     description: Retourne, pour chaque jour, le nombre de concerts, la capacité, les réservations et le taux de remplissage
 *     responses:
 *       200:
 *         description: Agrégats journaliers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ReportByDayItem'
 */
app.get('/reports/by-day', (_req: Request, res: Response) => {
  const sql = `
    WITH stats AS (${concertStatsBase})
    SELECT
      date(starts_at) AS day,
      COUNT(*) AS concerts,
      SUM(capacity) AS total_capacity,
      SUM(reserved) AS total_reserved,
      ROUND(100.0 * SUM(reserved) / NULLIF(SUM(capacity),0), 2) AS fill_rate,
      SUM(CASE WHEN remaining = 0 THEN 1 ELSE 0 END) AS sold_out
    FROM stats
    GROUP BY date(starts_at)
    ORDER BY day ASC`;
  res.json(all(sql));
});

// D) Total des réservations
/**
 * @swagger
 * /reports/total-reservations:
 *   get:
 *     tags:
 *       - Reports
 *     summary: Total des réservations
 *     description: Retourne le total cumulé des réservations sur tous les concerts
 *     responses:
 *       200:
 *         description: Total des réservations
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TotalReservations'
 */
app.get('/reports/total-reservations', (_req: Request, res: Response) => {
  const r = row(`SELECT COALESCE(SUM(qty),0) AS total FROM reservations`);
  res.json(r ?? { total: 0 });
});

// --- Boot ----------------------------------------------------------------------------------------
const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => {
  console.log(`Festival monolith (TS) running on http://localhost:${PORT}`);
});
