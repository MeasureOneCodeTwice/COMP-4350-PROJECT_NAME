//Index file for database service, sets up express server and routes

import express from "express";
import { accountsRouter } from "./routes/account";
import { transactionsRouter } from "./routes/transaction";
import { profilesRouter } from "./routes/profile";

const app = express();
app.use(express.json());

app.use("/accounts", accountsRouter);
app.use("/transactions", transactionsRouter);
app.use("/profiles", profilesRouter);

app.listen(3000, () => {
  console.log("Database service running on port 3000");
});
