import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import httpErrors from "http-errors";
import morgan from "morgan";
import * as path from "path";

dotenv.config();

import * as config from "./config";
import authRoutes from "./routes/auth";
import lobbyRoutes from "./routes/lobby";
import { timeMiddleware } from "./middleware/time";

import * as configuration from "./config";
import * as routes from "./routes";



const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(timeMiddleware);

const staticPath = path.join(process.cwd(), "src", "public");
app.use(express.static(staticPath));

config.configureLiveReload(app, staticPath);

app.use(cookieParser());
app.set("views", path.join(process.cwd(), "src", "server", "views"));
app.set("view engine", "ejs");

app.get("/", (_req, res) => {
    // todo auth middleware express-session & pg and/orrrr jwt
    // temp to test auth page set to true/false
    const is_authed = true;

    if (is_authed) {
        res.render("authenticated", {
            username: "user",
            lobbies: [],
        });
    } else {
        res.render("unauthenticated");
    }
});

// api routes
app.use("/api/auth", authRoutes);
app.use("/api/lobby", lobbyRoutes);

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


configuration.configureLiveReload(app, staticPath);

app.use("/", routes.home);
app.use("/lobby", routes.mainLobby);
app.use("/auth", routes.auth);
app.use("/games", routes.games);