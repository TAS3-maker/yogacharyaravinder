// Local API server for development:  npm run dev:api   (reads .env)
import 'dotenv/config';
import { createApp } from './app.js';

const port = Number(process.env.API_PORT || 8787);
createApp().listen(port, () => console.log(`Admin API on http://localhost:${port}/api`));
