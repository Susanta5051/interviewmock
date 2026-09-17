import { Request } from "express";
import multer, { StorageEngine, FileFilterCallback } from "multer";

const upload = multer({ storage: multer.memoryStorage() });

export default upload;

