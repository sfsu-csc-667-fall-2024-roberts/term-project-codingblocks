import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import httpErrors from "http-errors";
import morgan from "morgan";
import * as path from "path";

dotenv.config();

import { timeMiddleware } from "./middleware/time";
import authenticationMiddleware from "./middleware/authentication";

import * as configuration from "./config";
import * as routes from "./routes";

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(timeMiddleware);

const staticPath = path.join(process.cwd(), "src", "public");
app.use(express.static(staticPath));

configuration.configureLiveReload(app, staticPath);
configuration.configureSession(app);

app.use(cookieParser());
app.set("views", path.join(process.cwd(), "src", "server", "views"));
app.set("view engine", "ejs");

// api routes
app.use("/", routes.home);
app.use("/auth", routes.auth);
app.use("/lobby", authenticationMiddleware, routes.lobby);

app.use(
    (
        _req: express.Request,
        _res: express.Response,
        next: express.NextFunction,
    ) => {
        next(httpErrors(404));
    },
);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
