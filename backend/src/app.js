import express from "express";
import cors from "cors";
import todosRouter from "./routes/todos.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/todos", todosRouter);

// Unknown API routes get a JSON 404 (not the SPA's index.html)
app.use("/api", (_req, res) => res.status(404).json({ error: "Not found" }));

// Central error handler — keep it last
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Something went wrong" });
});

export default app;
