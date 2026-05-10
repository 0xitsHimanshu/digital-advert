import { Router } from "express";

export const echoRouter = Router();

echoRouter.all("/", (req, res) => {
  res.json({
    method: req.method,
    headers: req.headers,
    query: req.query,
    body: req.body,
    receivedAt: new Date().toISOString(),
  });
});
