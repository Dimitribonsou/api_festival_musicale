import { ParameterModel } from "../models/parameter.model.js";

export class ParameterRepository {
  async getNumber(key: string): Promise<number | undefined> {
    const p = await ParameterModel.findByPk(key);
    if (!p) return undefined;
    const n = Number(p.getDataValue("value"));
    return Number.isFinite(n) ? n : undefined;
  }
}
