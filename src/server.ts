import "dotenv/config";
import { sequelize } from "./data/sequelize.js";
import { createApp } from "./app.js";

const PORT = Number(process.env.PORT || 3000);

(async () => {
  await sequelize.authenticate();
  await sequelize.sync(); // ok pour MVP (préférer des migrations ensuite)
  const app = createApp();
  app.listen(PORT, () =>
    console.log(`Festival 3-tiers up on http://localhost:${PORT}`)
  );
})();
