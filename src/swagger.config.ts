import swaggerJsdoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Festival API",
      version: "1.0.0",
      description: "MVP Festival - programmation, réservations, rapports",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [],
  },
  apis: [
    "./src/presentation/routes/**/*.ts",
    "./src/presentation/controllers/**/*.ts",
  ],
});
