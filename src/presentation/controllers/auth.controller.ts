import type { Request, Response } from "express";
import { AuthService } from "../../business/services/auth.service.js";

export class AuthController {
  constructor(private svc: AuthService) {}

  register = async (req: Request, res: Response) => {
    try {
      const u = await this.svc.register(req.body);
      res.status(201).json(u);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const token = await this.svc.login(req.body);
      res.json(token);
    } catch (e: any) {
      res.status(401).json({ error: e.message });
    }
  };
}
