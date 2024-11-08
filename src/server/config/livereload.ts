import connectLiveReload from "connect-livereload";
import type { Express } from "express";
import livereload from "livereload";

export default (app: Express, staticPath: string) => {
  console.log(process.env.NODE_ENV);
  if (process.env.NODE_ENV === "development") {
    const reloadServer = livereload.createServer();

    reloadServer.watch(staticPath);
    reloadServer.server.once("connection", () => {
      setTimeout(() => {
        reloadServer.refresh("/");
      }, 100);
    });
    app.use(connectLiveReload());
  }
};
