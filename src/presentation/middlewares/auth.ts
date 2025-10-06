import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer "))
    return res.status(401).json({ error: "unauthorized" });
  try {
    const token = auth.substring(7);
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET || "dev-secret"
    ) as any;
    req.user = { id: Number(payload.sub), role: payload.role };
    next();
  } catch (e) {
    return res.status(401).json({ error: "unauthorized" });
  }
}

export function requireOrganizer(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.user) return res.status(401).json({ error: "unauthorized" });
  if (req.user.role !== "ORGANISATEUR")
    return res.status(403).json({ error: "forbidden" });
  next();
}
