"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_sts_1 = require("@aws-sdk/client-sts");
const client_resource_groups_tagging_api_1 = require("@aws-sdk/client-resource-groups-tagging-api");
const aws_1 = require("../lib/aws");
const cache_1 = require("../lib/cache");
const router = (0, express_1.Router)();
router.get('/status', async (req, res) => {
    try {
        const cached = cache_1.cache.get('platform_status');
        if (cached)
            return res.json(cached);
        const identityCmd = await aws_1.stsClient.send(new client_sts_1.GetCallerIdentityCommand({}));
        let resourceCount = 0;
        let pToken = undefined;
        let safetyCounter = 0; // limit huge accounts
        // Count resources
        do {
            const resources = await aws_1.rgClient.send(new client_resource_groups_tagging_api_1.GetResourcesCommand({
                PaginationToken: pToken,
                ResourcesPerPage: 100 // up to 100 per page
            }));
            if (resources.ResourceTagMappingList) {
                resourceCount += resources.ResourceTagMappingList.length;
            }
            pToken = resources.PaginationToken;
            safetyCounter++;
            if (safetyCounter > 5)
                break; // roughly count first 500 max to save time
        } while (pToken);
        const responseData = {
            accountId: identityCmd.Account,
            arn: identityCmd.Arn,
            userId: identityCmd.UserId,
            totalResources: resourceCount,
            regions: [process.env.AWS_REGION || 'us-east-1'],
            integrationStatus: 'ACTIVE'
        };
        cache_1.cache.set('platform_status', responseData);
        res.json(responseData);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/accounts', (req, res) => {
    // Return single configured account simulating multi-accounts
    res.json([{
            id: process.env.AWS_ACCESS_KEY_ID?.substring(0, 5) + '...',
            name: 'Primary Environment',
            status: 'CONNECTED',
            region: process.env.AWS_REGION || 'us-east-1'
        }]);
});
exports.default = router;
//# sourceMappingURL=platform.js.map