import { Router, Request, Response } from 'express';
import { GetEnrollmentStatusCommand, GetEC2InstanceRecommendationsCommand, AccountEnrollmentStatus } from '@aws-sdk/client-compute-optimizer';
import { DescribeVolumesCommand } from '@aws-sdk/client-ec2';
import { optimizeClient, ec2Client } from '../lib/aws';
import { cache } from '../lib/cache';

const router = Router();

router.get('/recommendations', async (req: Request, res: Response) => {
  try {
    const cached = cache.get('opt_recommendations');
    if (cached) return res.json(cached);

    // Some accounts might not have compute optimizer enrolled.
    let statusCheck;
    try {
        statusCheck = await optimizeClient.send(new GetEnrollmentStatusCommand({}));
    } catch {
        statusCheck = { status: 'FAILED' };
    }
    
    if (statusCheck.status !== AccountEnrollmentStatus.ACTIVE) {
        return res.json({ recommendations: [], error: 'Compute Optimizer not enrolled.' });
    }

    const command = new GetEC2InstanceRecommendationsCommand({});
    const reqData = await optimizeClient.send(command);
    
    const recs = (reqData.instanceRecommendations || []).map(r => ({
        arn: r.instanceArn,
        currentType: r.currentInstanceType,
        recommendedType: r.recommendationOptions?.[0]?.instanceType || 'None',
        finding: r.finding,
        savings: parseFloat(r.recommendationOptions?.[0]?.savingsOpportunity?.estimatedMonthlySavings?.value?.toString() || '0')
    }));

    cache.set('opt_recommendations', recs);
    res.json(recs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/savings', async (req: Request, res: Response) => {
    try {
        const cached = cache.get('opt_savings');
        if (cached) return res.json(cached);
        
        let savingsTotal = 0;
        
        // Example: Get unattached EBS volumes savings
        const vols = await ec2Client.send(new DescribeVolumesCommand({
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

        cache.set('opt_savings', { totalWaste: savingsTotal, ebsZombies: zombies });
        res.json({ totalWaste: savingsTotal, ebsZombies: zombies });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

router.get('/resources', async (req: Request, res: Response) => {
    // Return unified resources
    res.json({ message: "Check /savings or /recommendations endpoints for idle lists" });
});

export default router;
