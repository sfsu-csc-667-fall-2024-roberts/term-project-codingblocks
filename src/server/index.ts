import express from "express";
import * as routes from "./routes";
import configuration from "./config";

import path from "path";
const staticPath = path.join(process.cwd(), "src", "public");

const PORT = process.env.PORT || 3000;

const app = express();

// Middleware and static setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
configuration.configureLiveReload(app, staticPath);

// Add new games route
app.use("/games", routes.games);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
