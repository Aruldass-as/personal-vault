import { Router } from "express";
import Record from "../models/Record.js";
import { auth } from "../middleware/auth.js";

const router = Router();
router.use(auth);

// create
router.post("/", async (req, res) => {
  const doc = await Record.create({ ...req.body, userId: req.user.id });
  res.status(201).json(doc);
});

// list (basic filters)
router.get("/", async (req, res) => {
  const { q, category, tag } = req.query;
  const filter = { userId: req.user.id };
  if (category) filter.category = category;
  if (tag) filter.tags = tag;
  if (q) filter.$text = { $search: q };

  const items = await Record.find(filter).sort({ createdAt: -1 });
  res.json(items);
});

// update
router.put("/:id", async (req, res) => {
  const updated = await Record.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { new: true }
  );
  if (!updated) return res.status(404).json({ message: "Not found" });
  res.json(updated);
});

// delete
router.delete("/:id", async (req, res) => {
  const deleted = await Record.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  if (!deleted) return res.status(404).json({ message: "Not found" });
  res.json({ ok: true });
});

export default router;
