"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_ec2_1 = require("@aws-sdk/client-ec2");
const aws_1 = require("../lib/aws");
const router = (0, express_1.Router)();
// In-memory history of actions taken
const history = [];
router.get('/history', (req, res) => {
    res.json(history);
});
router.post('/action', async (req, res) => {
    const { actionType, resourceId, resourceType } = req.body;
    // e.g. actionType: 'STOP_EC2', 'START_EC2', 'DELETE_EBS'
    // resourceType: 'EC2', 'EBS'
    if (!actionType || !resourceId) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    const logEntry = {
        actionType,
        resourceId,
        resourceType,
        status: 'PENDING',
        timestamp: new Date().toISOString()
    };
    try {
        if (actionType === 'STOP_EC2') {
            const data = await aws_1.ec2Client.send(new client_ec2_1.StopInstancesCommand({ InstanceIds: [resourceId] }));
            logEntry.status = data.StoppingInstances?.[0]?.CurrentState?.Name === 'stopping' ? 'SUCCESS' : 'RUNNING';
        }
        else if (actionType === 'START_EC2') {
            const data = await aws_1.ec2Client.send(new client_ec2_1.StartInstancesCommand({ InstanceIds: [resourceId] }));
            logEntry.status = data.StartingInstances?.[0]?.CurrentState?.Name === 'pending' ? 'SUCCESS' : 'RUNNING';
        }
        else if (actionType === 'DELETE_EBS') {
            await aws_1.ec2Client.send(new client_ec2_1.DeleteVolumeCommand({ VolumeId: resourceId }));
            logEntry.status = 'SUCCESS';
        }
        else {
            logEntry.status = 'FAILED';
            return res.status(400).json({ error: "Unsupported actionType" });
        }
        history.unshift(logEntry);
        res.json({ message: "Action executed successfully", log: logEntry });
    }
    catch (error) {
        logEntry.status = 'FAILED';
        history.unshift({ ...logEntry, error: error.message });
        res.status(500).json({ error: error.message, log: logEntry });
    }
});
// Utility to list testable unattached volumes and running EC2 arrays for the UI
router.get('/resources', async (req, res) => {
    try {
        const instancesCmd = new client_ec2_1.DescribeInstancesCommand({
            Filters: [{ Name: 'instance-state-name', Values: ['running', 'stopped'] }]
        });
        const iData = await aws_1.ec2Client.send(instancesCmd);
        let instances = [];
        (iData.Reservations || []).forEach(r => {
            (r.Instances || []).forEach(i => {
                instances.push({
                    id: i.InstanceId,
                    type: i.InstanceType,
                    state: i.State?.Name,
                    name: i.Tags?.find(t => t.Key === 'Name')?.Value || 'Unknown'
                });
            });
        });
        res.json({ instances });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
exports.default = router;
//# sourceMappingURL=execution.js.map