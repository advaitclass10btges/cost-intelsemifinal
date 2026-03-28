import { Router, Request, Response } from 'express';
import { GetCallerIdentityCommand } from '@aws-sdk/client-sts';
import { GetResourcesCommand } from '@aws-sdk/client-resource-groups-tagging-api';
import { stsClient, rgClient } from '../lib/aws';
import { cache } from '../lib/cache';

const router = Router();

router.get('/status', async (req: Request, res: Response) => {
    try {
        const cached = cache.get('platform_status');
        if (cached) return res.json(cached);

        const identityCmd = await stsClient.send(new GetCallerIdentityCommand({}));
        
        let resourceCount = 0;
        let pToken: string | undefined = undefined;
        let safetyCounter = 0; // limit huge accounts
        
        // Count resources
        do {
            const resources = await rgClient.send(new GetResourcesCommand({
                PaginationToken: pToken,
                ResourcesPerPage: 100 // up to 100 per page
            }));
            
            if (resources.ResourceTagMappingList) {
                resourceCount += resources.ResourceTagMappingList.length;
            }
            pToken = resources.PaginationToken;
            safetyCounter++;
            if (safetyCounter > 5) break; // roughly count first 500 max to save time
        } while (pToken);
        
        const responseData = {
            accountId: identityCmd.Account,
            arn: identityCmd.Arn,
            userId: identityCmd.UserId,
            totalResources: resourceCount,
            regions: [process.env.AWS_REGION || 'us-east-1'],
            integrationStatus: 'ACTIVE'
        };

        cache.set('platform_status', responseData);
        res.json(responseData);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/accounts', (req: Request, res: Response) => {
    // Return single configured account simulating multi-accounts
    res.json([{ 
        id: process.env.AWS_ACCESS_KEY_ID?.substring(0, 5) + '...',
        name: 'Primary Environment',
        status: 'CONNECTED',
        region: process.env.AWS_REGION || 'us-east-1'
    }]);
});

export default router;
