import { ReportRepository } from "../../data/repositories/report.repository.js";

export class ReportService {
  constructor(private repo: ReportRepository) {}
  occupancy() {
    return this.repo.occupancy();
  }
  top(limit?: number) {
    return this.repo.top(limit ?? 5);
  }
  byDay() {
    return this.repo.byDay();
  }
  fillRate() {
    return this.repo.fillRate();
  }
  byArtist() {
    return this.repo.byArtist();
  }
  totalReservations() {
    return this.repo.totalReservations();
  }
}
