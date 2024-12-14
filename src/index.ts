import app from "./app";
import { PORT } from "./config";
import dbConnection from "./config/db";

app.listen(PORT, async () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  await dbConnection();
});
