import path from 'path';
import dotenv from 'dotenv';
// Load dotenv at the very top before any other imports that might use AWS
dotenv.config({ path: path.join(__dirname, '.env') });

import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import costRoutes from './routes/cost';
import intelligenceRoutes from './routes/intelligence';
import optimizationRoutes from './routes/optimization';
import executionRoutes from './routes/execution';
import platformRoutes from './routes/platform';
import alertRoutes from './routes/alerts';
import { alertService } from './services/alertService';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialize socket for services
alertService.setIo(io);

// Routes
app.use('/api/cost', costRoutes);
app.use('/api/intelligence', intelligenceRoutes);
app.use('/api/optimization', optimizationRoutes);
app.use('/api/execute', executionRoutes); // Fixed path to match frontend (changed 'execution' to 'execute')
app.use('/api/platform', platformRoutes);
app.use('/api/alerts', alertRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
  
  // Start background scanning
  alertService.startScanning();
});
