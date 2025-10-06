import { ArtistRepository } from "../../data/repositories/artist.repository.js";

export class ArtistService {
  constructor(private repo: ArtistRepository) {}
  list() {
    return this.repo.findAll();
  }
  create(input: {
    name: string;
    genre?: string;
    bioShort?: string;
    links?: string;
  }) {
    if (!input.name?.trim()) throw new Error("name required");
    return this.repo.create({ ...input, name: input.name.trim() } as any);
  }
  update(
    id: number,
    data: Partial<{
      name: string;
      genre: string;
      bioShort: string;
      links: string;
    }>
  ) {
    if (data.name && !data.name.trim()) throw new Error("name required");
    return this.repo.update(id, {
      ...data,
      ...(data.name ? { name: data.name.trim() } : {}),
    } as any);
  }
  remove(id: number) {
    return this.repo.delete(id);
  }
  get(id: number) {
    return this.repo.findById(id);
  }
}
