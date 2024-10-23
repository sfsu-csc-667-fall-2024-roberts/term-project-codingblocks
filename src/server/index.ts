import cookieParser from "cookie-parser";
import express from "express";
import httpErrors from "http-errors";
import morgan from "morgan";
import * as path from "path";

import rootRoutes from "./routes/root"
import { timeMiddleware } from "./middleware/time";

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(timeMiddleware);
app.use(express.static(
    path.join(process.cwd(), "src", "public"))
);
app.use(cookieParser());
app.set("views", path.join(process.cwd(), "src", "server", "views"));
app.set("view engine", "ejs");

app.get("/", rootRoutes);

app.use((_req: express.Request, _res: express.Response, next: express.NextFunction) => {
    next(httpErrors(404));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
