import "dotenv/config";
import app from "../src/app.js";

// This default export is what Vercel runs as a serverless function.
export default app;

// Local dev: `npm run dev` inside backend/ starts a normal listening server.
// On Vercel the VERCEL env var is set and the app is invoked per-request instead.
if (!process.env.VERCEL) {
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
}
