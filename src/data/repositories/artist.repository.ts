import { ArtistModel } from "../models/artist.model.js";

export class ArtistRepository {
  findAll() {
    return ArtistModel.findAll({ order: [["name", "ASC"]] });
  }
  create(data: Partial<ArtistModel>) {
    return ArtistModel.create(data as any);
  }
  update(id: number, data: Partial<ArtistModel["dataValues"]>) {
    return ArtistModel.update(data, { where: { id }, returning: true }).then(
      (r) => r[1][0] ?? null
    );
  }
  delete(id: number) {
    return ArtistModel.destroy({ where: { id } });
  }
  findById(id: number) {
    return ArtistModel.findByPk(id);
  }
}
