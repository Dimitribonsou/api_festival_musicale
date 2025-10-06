import "dotenv/config";
import { sequelize } from "../data/sequelize.js";
import { StageModel } from "../data/models/stage.model.js";
import { ArtistModel } from "../data/models/artist.model.js";
import { ConcertModel } from "../data/models/concert.model.js";
import { ParameterModel } from "../data/models/parameter.model.js";
import { UserModel } from "../data/models/user.model.js";
import bcrypt from "bcryptjs";

async function main() {
  await sequelize.authenticate();
  await sequelize.sync({ force: true });

  // Stages
  const [grande, moyenne, club] = await Promise.all([
    StageModel.create({ name: "Grande", capacity: 1000 } as any),
    StageModel.create({ name: "Moyenne", capacity: 600 } as any),
    StageModel.create({ name: "Club", capacity: 250 } as any),
  ]);

  // Artists
  const artists = await Promise.all(
    ["Alpha", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot"].map((n) =>
      ArtistModel.create({ name: n } as any)
    )
  );

  // Concerts: 8-12 over 2 days
  const base = new Date();
  const day1 = new Date(
    Date.UTC(
      base.getUTCFullYear(),
      base.getUTCMonth(),
      base.getUTCDate(),
      12,
      0,
      0
    )
  );
  const day2 = new Date(day1.getTime() + 24 * 3600 * 1000);
  const slots = [
    { stage: grande, start: 12, dur: 60 },
    { stage: moyenne, start: 13, dur: 60 },
    { stage: club, start: 14, dur: 60 },
    { stage: grande, start: 15, dur: 60 },
    { stage: moyenne, start: 16, dur: 60 },
    { stage: club, start: 17, dur: 60 },
  ];
  const mk = (d: Date, h: number, dur: number) => {
    const s = new Date(d);
    s.setUTCHours(h, 0, 0, 0);
    const e = new Date(s.getTime() + dur * 60000);
    return { startAt: s, endAt: e };
  };
  const concerts: any[] = [];
  for (const d of [day1, day2]) {
    for (const slot of slots) {
      const { startAt, endAt } = mk(d, slot.start, slot.dur);
      const artist = artists[Math.floor(Math.random() * artists.length)];
      concerts.push(
        await ConcertModel.create({
          stageId: (slot.stage as any).id,
          artistId: (artist as any).id,
          startAt,
          endAt,
          maxCapacity: (slot.stage as any).capacity,
        } as any)
      );
    }
  }

  // Parameter
  await ParameterModel.upsert({
    key: "CANCEL_DEADLINE_HOURS",
    value: "24",
  } as any);

  // Organizer user
  const hash = await bcrypt.hash("admin", 10);
  await UserModel.create({
    email: "admin@example.com",
    passwordHash: hash,
    role: "ORGANISATEUR",
  } as any);

  console.log("Seed completed");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
