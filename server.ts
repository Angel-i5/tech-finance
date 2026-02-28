import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// puerto dinámico mediante la variable de entorno PORT
const PORT = process.env.PORT || 3000; 

// Vite middleware for development
if (process.env.NODE_ENV !== "production") {
  const vite = await createViteServer({
    server: { 
      middlewareMode: true,
      // HMR configurado según vite.config.ts
      hmr: process.env.DISABLE_HMR !== 'true' 
    },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  // En producción, servimos los archivos estáticos de la carpeta 'dist'
  const distPath = path.join(__dirname, "dist");
  app.use(express.static(distPath));
  
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// CORRECCIÓN: Escuchar en '0.0.0.0' es correcto para contenedores/Render
app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`Server running on port ${PORT} (mode: ${process.env.NODE_ENV || 'development'})`);
});