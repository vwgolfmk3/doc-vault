import express from 'express';
import cors from 'cors';
import routes from './routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for client-side web prototype integrations
app.use(cors());

// Enable parsing of JSON request bodies
app.use(express.json());

// Log incoming REST API requests
app.use((req, res, next) => {
  console.log(`[API Gateway] ${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Register REST API router paths under version 1 endpoint
app.use('/api/v1', routes);

// Base health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: "healthy", services: "online", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(` Doc Vault - Production Backend Services Online!`);
  console.log(` API Gateway Endpoint: http://localhost:${PORT}/api/v1`);
  console.log(` Base health check:   http://localhost:${PORT}/health`);
  console.log(`======================================================\n`);
});
