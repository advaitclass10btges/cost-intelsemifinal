import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import costRoutes from './routes/cost';
import intelligenceRoutes from './routes/intelligence';
import optimizationRoutes from './routes/optimization';
import executionRoutes from './routes/execution';
import platformRoutes from './routes/platform';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/cost', costRoutes);
app.use('/api/intelligence', intelligenceRoutes);
app.use('/api/optimization', optimizationRoutes);
app.use('/api/execute', executionRoutes);
app.use('/api/platform', platformRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'CostIntel API is running' });
});

app.listen(PORT, () => {
  console.log(`Backend proxy running on http://localhost:${PORT}`);
});
