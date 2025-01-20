import express, { NextFunction, Response, Request } from "express";
import { rm, unlink } from "fs/promises";
import multer from "multer";
import helmet from "helmet";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./router";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 4000;

const app = express();
const upload = multer({ dest: "uploads" });

app.use(helmet());
app.disable("x-powered-by");

app.use(
  "/trpc",
  upload.fields([
    { name: "jobDescription", maxCount: 1 },
    { name: "cv", maxCount: 1 },
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as Record<string, Express.Multer.File[]>;
    if (files?.jobDescription?.length !== 1 || files?.cv?.length !== 1) {
      files?.jobDescription?.[0]?.path &&
        (await unlink(files.jobDescription[0].path));
      files?.cv?.[0]?.path && (await unlink(files.cv[0].path));
      res.status(400).send("Please provide two PDFs: jobDescription and CV.");
    } else {
      req.body.jobDescription = files.jobDescription?.[0]?.path;
      req.body.cv = files.cv?.[0]?.path;
      next();
    }
  },
  createExpressMiddleware({
    router: appRouter,
  }),
);

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error processing request:", error);
  res.status(500).send(error);
});

const server = app.listen(PORT, () => {
  console.info(`Server running on http://localhost:${PORT}`);
});

process.on(
  "uncaughtException",
  async (error: Error, origin: NodeJS.UncaughtExceptionOrigin) => {
    console.error("Uncaught exception:", origin, error);

    try {
      await rm("uploads", { recursive: true });
    } catch (error) {
      console.error("Error deleting uploads directory:", error);
    }

    server.close(() => {
      console.debug("HTTP server closed");
    });
    process.exit(1);
  },
);

function handleSignalEvents(signal: NodeJS.Signals) {
  console.debug(`${signal} signal received: closing HTTP server`);
  server.close(() => {
    console.debug("HTTP server closed");
  });
}

process.on("SIGTERM", handleSignalEvents);
process.on("SIGINT", handleSignalEvents);
