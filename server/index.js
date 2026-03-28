"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const cost_1 = __importDefault(require("./routes/cost"));
const intelligence_1 = __importDefault(require("./routes/intelligence"));
const optimization_1 = __importDefault(require("./routes/optimization"));
const execution_1 = __importDefault(require("./routes/execution"));
const platform_1 = __importDefault(require("./routes/platform"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/cost', cost_1.default);
app.use('/api/intelligence', intelligence_1.default);
app.use('/api/optimization', optimization_1.default);
app.use('/api/execute', execution_1.default);
app.use('/api/platform', platform_1.default);
// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'CostIntel API is running' });
});
app.listen(PORT, () => {
    console.log(`Backend proxy running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map