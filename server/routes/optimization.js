"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_compute_optimizer_1 = require("@aws-sdk/client-compute-optimizer");
const client_ec2_1 = require("@aws-sdk/client-ec2");
const aws_1 = require("../lib/aws");
const cache_1 = require("../lib/cache");
const router = (0, express_1.Router)();
router.get('/recommendations', async (req, res) => {
    try {
        const cached = cache_1.cache.get('opt_recommendations');
        if (cached)
            return res.json(cached);
        // Some accounts might not have compute optimizer enrolled.
        let statusCheck;
        try {
            statusCheck = await aws_1.optimizeClient.send(new client_compute_optimizer_1.GetEnrollmentStatusCommand({}));
        }
        catch {
            statusCheck = { status: 'FAILED' };
        }
        if (statusCheck.status !== client_compute_optimizer_1.AccountEnrollmentStatus.ACTIVE) {
            return res.json({ recommendations: [], error: 'Compute Optimizer not enrolled.' });
        }
        const command = new client_compute_optimizer_1.GetEC2InstanceRecommendationsCommand({});
        const reqData = await aws_1.optimizeClient.send(command);
        const recs = (reqData.instanceRecommendations || []).map(r => ({
            arn: r.instanceArn,
            currentType: r.currentInstanceType,
            recommendedType: r.recommendationOptions?.[0]?.instanceType || 'None',
            finding: r.finding,
            savings: parseFloat(r.recommendationOptions?.[0]?.savingsOpportunity?.estimatedMonthlySavings?.value?.toString() || '0')
        }));
        cache_1.cache.set('opt_recommendations', recs);
        res.json(recs);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/savings', async (req, res) => {
    try {
        const cached = cache_1.cache.get('opt_savings');
        if (cached)
            return res.json(cached);
        let savingsTotal = 0;
        // Example: Get unattached EBS volumes savings
        const vols = await aws_1.ec2Client.send(new client_ec2_1.DescribeVolumesCommand({
            Filters: [{ Name: 'status', Values: ['available'] }] // Unattached
        }));
        const zombies = (vols.Volumes || []).map(vol => ({
            id: vol.VolumeId,
            size: vol.Size || 0,
            type: vol.VolumeType,
            // rough est: $0.1/GB for standard gp3
            estimatedWaste: (vol.Size || 0) * 0.1
        }));
        const waste = zombies.reduce((acc, curr) => acc + curr.estimatedWaste, 0);
        savingsTotal += waste;
        cache_1.cache.set('opt_savings', { totalWaste: savingsTotal, ebsZombies: zombies });
        res.json({ totalWaste: savingsTotal, ebsZombies: zombies });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
router.get('/resources', async (req, res) => {
    // Return unified resources
    res.json({ message: "Check /savings or /recommendations endpoints for idle lists" });
});
exports.default = router;
//# sourceMappingURL=optimization.js.map