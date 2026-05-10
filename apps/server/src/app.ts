import express, { type Application, type ErrorRequestHandler } from "express";
import cors from "cors";
import morgan from "morgan";
import { healthRouter } from "./routes/health.js";
import { adsRouter } from "./routes/ads.js";
import { echoRouter } from "./routes/echo.js";

export function createApp(): Application {
  const app = express();

  const origins = (process.env.CORS_ORIGIN ?? "*")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  app.use(
    cors({
      origin: origins.includes("*") ? true : origins,
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan("dev"));

  app.get("/", (_req, res) => {
    res.json({
      name: "digital-advert-server",
      status: "ok",
      docs: ["/api/health", "/api/ads", "/api/ads/:id", "/api/echo"],
    });
  });

  app.use("/api/health", healthRouter);
  app.use("/api/ads", adsRouter);
  app.use("/api/echo", echoRouter);

  app.use((req, res) => {
    res.status(404).json({ error: "Not Found", path: req.originalUrl });
  });

  const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    // eslint-disable-next-line no-console
    console.error("[server] error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  };
  app.use(errorHandler);

  return app;
}
