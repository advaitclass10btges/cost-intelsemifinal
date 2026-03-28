"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_cost_explorer_1 = require("@aws-sdk/client-cost-explorer");
const aws_1 = require("../lib/aws");
const cache_1 = require("../lib/cache");
const router = (0, express_1.Router)();
const getDates = () => {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const formatDate = (date) => date.toISOString().split('T')[0];
    return {
        today: formatDate(today),
        sevenDaysAgo: formatDate(sevenDaysAgo),
        thirtyDaysAgo: formatDate(thirtyDaysAgo),
        endOfMonth: formatDate(endOfMonth)
    };
};
router.get('/monthly', async (req, res) => {
    try {
        const cached = cache_1.cache.get('cost_monthly');
        if (cached)
            return res.json(cached);
        const { thirtyDaysAgo, today } = getDates();
        if (thirtyDaysAgo === today) {
            // Prevent validation error if dates are same
            return res.json({ total: 0, priorTotal: 0 });
        }
        const params = {
            TimePeriod: { Start: thirtyDaysAgo, End: today },
            Granularity: 'MONTHLY',
            Metrics: ['UnblendedCost']
        };
        const data = await aws_1.ceClient.send(new client_cost_explorer_1.GetCostAndUsageCommand(params));
        const results = data.ResultsByTime || [];
        const total = results.length > 0 ? parseFloat(results[0].Total?.UnblendedCost?.Amount || '0') : 0;
        const response = {
            total: total.toFixed(2),
            priorTotal: (total * 0.9).toFixed(2), // Mocking prior total for now, or we'd need a 60-day query
            currency: 'USD'
        };
        cache_1.cache.set('cost_monthly', response);
        res.json(response);
    }
    catch (error) {
        console.error('Error fetching monthly cost:', error);
        res.status(500).json({ error: error.message });
    }
});
router.get('/trend', async (req, res) => {
    try {
        const cached = cache_1.cache.get('cost_trend');
        if (cached)
            return res.json(cached);
        const { sevenDaysAgo, today } = getDates();
        if (sevenDaysAgo === today) {
            return res.json([]);
        }
        const params = {
            TimePeriod: { Start: sevenDaysAgo, End: today },
            Granularity: 'DAILY',
            Metrics: ['UnblendedCost']
        };
        const data = await aws_1.ceClient.send(new client_cost_explorer_1.GetCostAndUsageCommand(params));
        const trend = (data.ResultsByTime || []).map(item => ({
            date: item.TimePeriod?.Start,
            amount: parseFloat(item.Total?.UnblendedCost?.Amount || '0')
        }));
        cache_1.cache.set('cost_trend', trend);
        res.json(trend);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/breakdown', async (req, res) => {
    try {
        const cached = cache_1.cache.get('cost_breakdown');
        if (cached)
            return res.json(cached);
        const { thirtyDaysAgo, today } = getDates();
        if (thirtyDaysAgo === today) {
            return res.json([]);
        }
        const params = {
            TimePeriod: { Start: thirtyDaysAgo, End: today },
            Granularity: 'MONTHLY',
            Metrics: ['UnblendedCost'],
            GroupBy: [{ Type: 'DIMENSION', Key: 'SERVICE' }]
        };
        const data = await aws_1.ceClient.send(new client_cost_explorer_1.GetCostAndUsageCommand(params));
        const groups = data.ResultsByTime?.[0]?.Groups || [];
        const breakdown = groups
            .map(group => ({
            service: group.Keys?.[0] || 'Unknown',
            amount: parseFloat(group.Metrics?.UnblendedCost?.Amount || '0')
        }))
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 5); // top 5
        cache_1.cache.set('cost_breakdown', breakdown);
        res.json(breakdown);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/forecast', async (req, res) => {
    try {
        const cached = cache_1.cache.get('cost_forecast');
        if (cached)
            return res.json(cached);
        const { today, endOfMonth } = getDates();
        // AWS requires start date to be > today for forecast, but if today is end of month it fails.
        const start = new Date();
        start.setDate(start.getDate() + 1);
        const end = new Date(start);
        end.setDate(end.getDate() + 30); // forecast 30 days out
        const formatDate = (date) => date.toISOString().split('T')[0];
        try {
            const data = await aws_1.ceClient.send(new client_cost_explorer_1.GetCostForecastCommand({
                TimePeriod: { Start: formatDate(start), End: formatDate(end) },
                Metric: 'UNBLENDED_COST',
                Granularity: 'MONTHLY'
            }));
            const response = {
                amount: parseFloat(data.Total?.Amount || '0').toFixed(2),
                currency: 'USD'
            };
            cache_1.cache.set('cost_forecast', response);
            res.json(response);
        }
        catch (e) {
            // Forecast fails if not enough history
            console.warn("Forecast API error (might not have history):", e.message);
            res.json({ amount: "0.00", currency: "USD", error: "Not enough data for forecast" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=cost.js.map