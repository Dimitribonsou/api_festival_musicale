declare module "bcryptjs";
declare module "jsonwebtoken";
declare module "swagger-jsdoc";

declare namespace Express {
  export interface Request {
    user?: { id: number; role: "PUBLIC" | "ORGANISATEUR" };
  }
}
