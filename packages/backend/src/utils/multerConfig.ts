import multer, { FileFilterCallback, diskStorage } from "multer";
import { Request } from "express";
import path from "path";
import fs from "fs";

const fileStorage = diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, destination: string) => void
  ) => {
    const destinationPath = path.join(__dirname, "../../public/images");
    fs.mkdirSync(destinationPath, { recursive: true });
    callback(null, destinationPath);
  },

  filename: (
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, filename: string) => void
  ) => {
    const now = new Date();
    const dateStr = now.toLocaleDateString().replace(/\//g, "-");
    const timeStr = now
      .toLocaleTimeString()
      .replace(/:/g, "-")
      .replace(/\s/g, "");
    const originalFilename = file.originalname.replace(/\s/g, "_");
    const filename = `${dateStr}_${timeStr}_${originalFilename}`;
    callback(null, filename);
  },
});

const imageFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback
) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/))
    return callback(new Error("Only image files are allowed"));
  callback(null, true);
};

export const upload = multer({ storage: fileStorage, fileFilter: imageFilter });
