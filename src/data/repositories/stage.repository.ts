import { StageModel } from "../models/stage.model.js";
export class StageRepository {
  list() {
    return StageModel.findAll({ order: [["capacity", "DESC"]] });
  }
  create(d: Partial<StageModel>) {
    return StageModel.create(d as any);
  }
  update(id: number, d: Partial<StageModel["_attributes"]>) {
    return StageModel.update(d, { where: { id }, returning: true }).then(
      (r) => r[1][0] ?? null
    );
  }
  delete(id: number) {
    return StageModel.destroy({ where: { id } });
  }
  findById(id: number) {
    return StageModel.findByPk(id);
  }
}
