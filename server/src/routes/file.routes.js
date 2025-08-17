import { Router } from "express";
import multer from "multer";
import mongoose from "mongoose";
import { auth } from "../middleware/auth.js";
import Record from "../models/Record.js";

const router = Router();
router.use(auth);

// Use memory storage then pipe to GridFSBucket
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } }); // 20MB

router.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file provided" });

  const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: "files" });
  const metadata = { userId: req.user.id, originalname: req.file.originalname, mimetype: req.file.mimetype };

  const uploadStream = bucket.openUploadStream(req.file.originalname, { metadata, contentType: req.file.mimetype });
  uploadStream.end(req.file.buffer);

  uploadStream.on("finish", () => res.status(201).json({ fileId: uploadStream.id }));
  uploadStream.on("error", (e) => res.status(500).json({ message: e.message }));
});

// link a file to a record
router.post("/link", async (req, res) => {
  const { recordId, fileId } = req.body || {};
  const rec = await Record.findOne({ _id: recordId, userId: req.user.id });
  if (!rec) return res.status(404).json({ message: "Record not found" });
  rec.fileIds.push(new mongoose.Types.ObjectId(fileId));
  await rec.save();
  res.json(rec);
});

// list current user's files (metadata only)
router.get("/", async (_req, res) => {
  const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: "files" });
  const files = await bucket.find({ "metadata.userId": res.req.user.id }).toArray();
  res.json(files);
});

// download
router.get("/:id", async (req, res) => {
  const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: "files" });
  const _id = new mongoose.Types.ObjectId(req.params.id);
  const files = await bucket.find({ _id, "metadata.userId": req.user.id }).toArray();
  if (!files.length) return res.status(404).json({ message: "Not found" });

  res.setHeader("Content-Type", files[0].contentType || "application/octet-stream");
  res.setHeader("Content-Disposition", `attachment; filename="${files[0].filename}"`);
  bucket.openDownloadStream(_id).pipe(res);
});

// delete
router.delete("/:id", async (req, res) => {
  const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: "files" });
  const _id = new mongoose.Types.ObjectId(req.params.id);
  try {
    await bucket.delete(_id);
    // also remove references from records
    await Record.updateMany(
      { userId: req.user.id },
      { $pull: { fileIds: _id } }
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(404).json({ message: "Not found" });
  }
});

export default router;
