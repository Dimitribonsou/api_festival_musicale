import { StageRepository } from "../../data/repositories/stage.repository.js";
export class StageService {
  constructor(private repo: StageRepository) {}
  list() {
    return this.repo.list();
  }
  create(d: { name: string; capacity: number }) {
    if (!d.name?.trim() || !Number.isFinite(d.capacity) || d.capacity < 1)
      throw new Error("invalid stage");
    return this.repo.create({
      name: d.name.trim(),
      capacity: Math.floor(d.capacity),
    } as any);
  }
  update(id: number, d: Partial<{ name: string; capacity: number }>) {
    if (d.capacity !== undefined && d.capacity < 1)
      throw new Error("invalid capacity");
    if (d.name !== undefined && !d.name.trim()) throw new Error("invalid name");
    return this.repo.update(id, {
      ...d,
      ...(d.name ? { name: d.name.trim() } : {}),
    } as any);
  }
  remove(id: number) {
    return this.repo.delete(id);
  }
  get(id: number) {
    return this.repo.findById(id);
  }
}
