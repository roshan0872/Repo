import { Router } from "express";
import Todo from "../models/Todo.js";
import { connectDB } from "../db.js";

const router = Router();

// GET /api/todos
router.get("/", async (_req, res, next) => {
  try {
    await connectDB();
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    next(err);
  }
});

// POST /api/todos
router.post("/", async (req, res, next) => {
  try {
    await connectDB();
    const { title } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Title is required" });
    }
    const todo = await Todo.create({ title: title.trim() });
    res.status(201).json(todo);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/todos/:id — toggle done and/or rename
router.patch("/:id", async (req, res, next) => {
  try {
    await connectDB();
    const { title, completed } = req.body;
    const update = {};
    if (typeof completed === "boolean") update.completed = completed;
    if (typeof title === "string" && title.trim()) update.title = title.trim();

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ error: "Nothing to update" });
    }

    const todo = await Todo.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!todo) return res.status(404).json({ error: "Todo not found" });
    res.json(todo);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/todos/:id
router.delete("/:id", async (req, res, next) => {
  try {
    await connectDB();
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) return res.status(404).json({ error: "Todo not found" });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
