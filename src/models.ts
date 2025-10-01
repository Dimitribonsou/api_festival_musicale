import { Sequelize, DataTypes, Model } from 'sequelize';

const sequelize = new Sequelize({
    dialect: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'festival_db',
    username: 'postgres',
    password: 'password',
    logging: false
});

// Class Artiste
export class Artiste extends Model {
    private id!: number;
    private nom!: string;
    private genre!: string;
    private bioCourte?: string | undefined;
    private liens?: string | undefined;

    // Getters and Setters
    get Id() { return this.id; }
    set Id(value: number) { this.id = value; }

    get Nom() { return this.nom; }
    set Nom(value: string) { this.nom = value; }

    get Genre() { return this.genre; }
    set Genre(value: string) { this.genre = value; }

    get BioCourte() { return this.bioCourte; }
    set BioCourte(value: string | undefined) { this.bioCourte = value; }

    get Liens() { return this.liens; }
    set Liens(value: string | undefined) { this.liens = value; }
}

// Class Scene
export class Scene extends Model {
    private id!: number;
    private nom!: string;
    private capacite!: number;

    // Getters and Setters
    get Id() { return this.id; }
    set Id(value: number) { this.id = value; }

    get Nom() { return this.nom; }
    set Nom(value: string) { this.nom = value; }

    get Capacite() { return this.capacite; }
    set Capacite(value: number) { this.capacite = value; }
}

// Class Concert
export class Concert extends Model {
    private id!: number;
    private sceneId!: number;
    private artisteId!: number;
    private debut!: Date;
    private fin!: Date;
    private capaciteMax!: number;
    private statut!: string;

    // Getters and Setters
    get Id() { return this.id; }
    set Id(value: number) { this.id = value; }

    get SceneId() { return this.sceneId; }
    set SceneId(value: number) { this.sceneId = value; }

    get ArtisteId() { return this.artisteId; }
    set ArtisteId(value: number) { this.artisteId = value; }

    get Debut() { return this.debut; }
    set Debut(value: Date) { this.debut = value; }

    get Fin() { return this.fin; }
    set Fin(value: Date) { this.fin = value; }

    get CapaciteMax() { return this.capaciteMax; }
    set CapaciteMax(value: number) { this.capaciteMax = value; }

    get Statut() { return this.statut; }
    set Statut(value: string) { this.statut = value; }
}

// Class Utilisateur
export class Utilisateur extends Model {
    private id!: number;
    private email!: string;
    private role!: 'PUBLIC' | 'ORGANISATEUR';
    private hashMdp!: string;

    // Getters and Setters
    get Id() { return this.id; }
    set Id(value: number) { this.id = value; }

    get Email() { return this.email; }
    set Email(value: string) { this.email = value; }

    get Role() { return this.role; }
    set Role(value: 'PUBLIC' | 'ORGANISATEUR') { this.role = value; }

    get HashMdp() { return this.hashMdp; }
    set HashMdp(value: string) { this.hashMdp = value; }
}

// Class Reservation
export class Reservation extends Model {
    private id!: number;
    private concertId!: number;
    private userId!: number;
    private nbPlaces!: number;
    private statut!: string;
    private createdAt!: Date;

    // Getters and Setters
    get Id() { return this.id; }
    set Id(value: number) { this.id = value; }

    get ConcertId() { return this.concertId; }
    set ConcertId(value: number) { this.concertId = value; }

    get UserId() { return this.userId; }
    set UserId(value: number) { this.userId = value; }

    get NbPlaces() { return this.nbPlaces; }
    set NbPlaces(value: number) { this.nbPlaces = value; }

    get Statut() { return this.statut; }
    set Statut(value: string) { this.statut = value; }

    get CreatedAt() { return this.createdAt; }
    set CreatedAt(value: Date) { this.createdAt = value; }
}

// Methodes init pour chaque class
Artiste.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nom: { type: DataTypes.STRING, allowNull: false },
    genre: { type: DataTypes.STRING, allowNull: false },
    bioCourte: { type: DataTypes.TEXT, allowNull: true },
    liens: { type: DataTypes.STRING, allowNull: true }
}, { sequelize, modelName: 'artiste' });

Scene.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nom: { type: DataTypes.STRING, allowNull: false },
    capacite: { type: DataTypes.INTEGER, allowNull: false }
}, { sequelize, modelName: 'scene' });

Concert.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    sceneId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Scene, key: 'id' } },
    artisteId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Artiste, key: 'id' } },
    debut: { type: DataTypes.DATE, allowNull: false },
    fin: { type: DataTypes.DATE, allowNull: false },
    capaciteMax: { type: DataTypes.INTEGER, allowNull: false },
    statut: { type: DataTypes.STRING, allowNull: false }
}, { sequelize, modelName: 'concert' });

Utilisateur.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    role: { type: DataTypes.ENUM('PUBLIC', 'ORGANISATEUR'), allowNull: false },
    hashMdp: { type: DataTypes.STRING, allowNull: false }
}, { sequelize, modelName: 'utilisateur' });

Reservation.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    concertId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Concert, key: 'id' } },
    userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Utilisateur, key: 'id' } },
    nbPlaces: { type: DataTypes.INTEGER, allowNull: false },
    statut: { type: DataTypes.STRING, allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
}, { sequelize, modelName: 'reservation', updatedAt: false });


// Associations entre les classes
Artiste.hasMany(Concert, { foreignKey: 'artisteId' });
Concert.belongsTo(Artiste, { foreignKey: 'artisteId' });

Scene.hasMany(Concert, { foreignKey: 'sceneId' });
Concert.belongsTo(Scene, { foreignKey: 'sceneId' });

Utilisateur.hasMany(Reservation, { foreignKey: 'userId' });
Reservation.belongsTo(Utilisateur, { foreignKey: 'userId' });

Concert.hasMany(Reservation, { foreignKey: 'concertId' });
Reservation.belongsTo(Concert, { foreignKey: 'concertId' });

export { sequelize };