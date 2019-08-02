import path from "path";
import fs from "fs";
import { Application, Request, Response } from "express";

export default function staticRoute(app: Application) {
  app.get("/need-to-update-browser", (req: Request, res: Response) => {
    fs.readFile(
      path.resolve(__dirname, "../static/update-browser.html"),
      (err, file) => {
        const newFile = file.toString("utf8");
        res.set("Content-Type", "text/html; charset=utf-8");
        res.status(200).end(newFile);
      }
    );
  });
}
