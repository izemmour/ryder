import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  // Serve static assets with aggressive caching for production
  // Images, fonts, and hashed assets get long cache (1 year)
  app.use(
    express.static(distPath, {
      maxAge: "1y", // 1 year cache for static assets
      etag: true,
      lastModified: true,
      setHeaders: (res, filePath) => {
        // WebP and optimized images - aggressive caching
        if (filePath.endsWith(".webp") || filePath.includes("/optimized/")) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        }
        // Hashed JS/CSS bundles - immutable (Vite adds content hash)
        else if (
          filePath.match(/\.[a-f0-9]{8}\.(js|css)$/) ||
          filePath.includes("/assets/")
        ) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        }
        // Other images (PNG, JPG, SVG) - long cache
        else if (filePath.match(/\.(png|jpg|jpeg|gif|svg|ico)$/)) {
          res.setHeader("Cache-Control", "public, max-age=2592000"); // 30 days
        }
        // Fonts - long cache
        else if (filePath.match(/\.(woff|woff2|ttf|eot)$/)) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        }
        // HTML - short cache with revalidation
        else if (filePath.endsWith(".html")) {
          res.setHeader(
            "Cache-Control",
            "public, max-age=0, must-revalidate"
          );
        }
      },
    })
  );

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    // HTML should not be cached aggressively
    res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
