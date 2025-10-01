import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Festival Musical',
    version: '1.0.0',
    description: 'API pour la gestion d\'un festival musical avec artistes, concerts et réservations',
    contact: {
      name: 'Équipe de développement',
      email: 'dev@festival-musical.com'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Serveur de développement'
    }
  ],
  components: {
    schemas: {
      Artist: {
        type: 'object',
        required: ['name'],
        properties: {
          id: {
            type: 'integer',
            description: 'Identifiant unique de l\'artiste',
            example: 1
          },
          name: {
            type: 'string',
            description: 'Nom de l\'artiste',
            example: 'The Beatles'
          }
        }
      },
      Concert: {
        type: 'object',
        required: ['artist_id', 'starts_at', 'capacity'],
        properties: {
          id: {
            type: 'integer',
            description: 'Identifiant unique du concert',
            example: 1
          },
          artist_id: {
            type: 'integer',
            description: 'Identifiant de l\'artiste',
            example: 1
          },
          starts_at: {
            type: 'string',
            format: 'date-time',
            description: 'Date et heure de début du concert (ISO 8601)',
            example: '2025-07-15T20:00:00Z'
          },
          capacity: {
            type: 'integer',
            minimum: 0,
            description: 'Capacité maximale du concert',
            example: 5000
          }
        }
      },
      ConcertStats: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            description: 'Identifiant unique du concert',
            example: 1
          },
          artist: {
            type: 'string',
            description: 'Nom de l\'artiste',
            example: 'The Beatles'
          },
          starts_at: {
            type: 'string',
            format: 'date-time',
            description: 'Date et heure de début du concert',
            example: '2025-07-15T20:00:00Z'
          },
          capacity: {
            type: 'integer',
            description: 'Capacité maximale du concert',
            example: 5000
          },
          reserved: {
            type: 'integer',
            description: 'Nombre de places réservées',
            example: 3200
          },
          remaining: {
            type: 'integer',
            description: 'Nombre de places restantes',
            example: 1800
          },
          fill_rate: {
            type: 'number',
            nullable: true,
            description: 'Taux de remplissage en pourcentage',
            example: 64.0
          }
        }
      },
      Reservation: {
        type: 'object',
        required: ['concert_id', 'email', 'qty'],
        properties: {
          id: {
            type: 'integer',
            description: 'Identifiant unique de la réservation',
            example: 1
          },
          concert_id: {
            type: 'integer',
            description: 'Identifiant du concert',
            example: 1
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'Email du réservant',
            example: 'user@example.com'
          },
          qty: {
            type: 'integer',
            minimum: 1,
            description: 'Nombre de places réservées',
            example: 2
          }
        }
      },
      Error: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            description: 'Message d\'erreur',
            example: 'Ressource non trouvée'
          }
        }
      },
      FillRateReport: {
        type: 'object',
        properties: {
          concerts: {
            type: 'integer',
            description: 'Nombre total de concerts'
          },
          total_capacity: {
            type: 'integer',
            description: 'Capacité totale de tous les concerts'
          },
          total_reserved: {
            type: 'integer',
            description: 'Total des réservations'
          },
          overall_fill_rate: {
            type: 'number',
            description: 'Taux de remplissage global en %'
          },
          sold_out: {
            type: 'integer',
            description: 'Nombre de concerts complets'
          },
          min_fill_rate: {
            type: 'number',
            description: 'Taux de remplissage minimum'
          },
          max_fill_rate: {
            type: 'number',
            description: 'Taux de remplissage maximum'
          },
          avg_fill_rate: {
            type: 'number',
            description: 'Taux de remplissage moyen'
          }
        }
      },
      ReportByArtistItem: {
        type: 'object',
        properties: {
          artist_id: { type: 'integer', description: "Identifiant de l'artiste", example: 1 },
          artist: { type: 'string', description: "Nom de l'artiste", example: 'The Beatles' },
          concerts: { type: 'integer', description: 'Nombre de concerts', example: 3 },
          capacity: { type: 'integer', description: 'Capacité totale', example: 12000 },
          reserved: { type: 'integer', description: 'Places réservées totales', example: 9500 },
          fill_rate: { type: 'number', nullable: true, description: 'Taux de remplissage en %', example: 79.17 }
        }
      },
      ReportByDayItem: {
        type: 'object',
        properties: {
          day: { type: 'string', format: 'date', description: 'Jour (YYYY-MM-DD)', example: '2025-07-15' },
          concerts: { type: 'integer', description: 'Nombre de concerts ce jour', example: 2 },
          total_capacity: { type: 'integer', description: 'Capacité totale du jour', example: 8000 },
          total_reserved: { type: 'integer', description: 'Réservations totales du jour', example: 6200 },
          fill_rate: { type: 'number', description: 'Taux de remplissage du jour en %', example: 77.5 },
          sold_out: { type: 'integer', description: 'Nombre de concerts complets ce jour', example: 1 }
        }
      },
      TotalReservations: {
        type: 'object',
        properties: {
          total: { type: 'integer', description: 'Total des réservations', example: 15420 }
        }
      }
    },
    responses: {
      BadRequest: {
        description: 'Requête invalide',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            }
          }
        }
      },
      NotFound: {
        description: 'Ressource non trouvée',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            }
          }
        }
      },
      Conflict: {
        description: 'Conflit - ressource déjà existante',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            }
          }
        }
      }
    }
  },
  tags: [
    {
      name: 'Artists',
      description: 'Gestion des artistes'
    },
    {
      name: 'Concerts',
      description: 'Gestion des concerts'
    },
    {
      name: 'Programming',
      description: 'Programmation disponible'
    },
    {
      name: 'Reservations',
      description: 'Gestion des réservations'
    },
    {
      name: 'Reports',
      description: 'Rapports et statistiques'
    }
  ]
};

const options = {
  definition: swaggerDefinition,
  apis: ['./src/*.ts'], // Chemin vers les fichiers contenant les annotations Swagger
};

export const swaggerSpec = swaggerJSDoc(options);