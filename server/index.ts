import "dotenv/config";
import { createServer } from "http";
import { app } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { type Request, type Response, type NextFunction } from "express";

(async () => {
  const server = createServer(app);

  // Global Error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Setup Vite (Development) or Static Files (Production/Local)
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Start Server (Local only - Vercel handles this via api/index.ts)
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port}`);
  });
})();