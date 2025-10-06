import type { Request, Response } from "express";
import { ParameterRepository } from "../../data/repositories/parameter.repository.js";
import { ParameterModel } from "../../data/models/parameter.model.js";

export class ParameterController {
  constructor(private repo: ParameterRepository) {}

  get = async (req: Request, res: Response) => {
    const key = req.params.key;
    const p = await ParameterModel.findByPk(key);
    if (!p) return res.status(404).json({ error: "not found" });
    res.json({ key, value: p.getDataValue("value") });
  };

  set = async (req: Request, res: Response) => {
    const key = req.params.key;
    const value = String(req.body.value ?? "");
    if (!key || !value) return res.status(400).json({ error: "invalid" });
    const [p] = await ParameterModel.upsert({ key, value } as any);
    res.json({ key, value: p.getDataValue("value") });
  };
}
