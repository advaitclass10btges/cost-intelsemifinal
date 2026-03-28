import { Router, Request, Response } from 'express';
import { 
    StopInstancesCommand, 
    StartInstancesCommand, 
    DeleteVolumeCommand, 
    DescribeInstancesCommand 
} from '@aws-sdk/client-ec2';
import { ec2Client } from '../lib/aws';

const router = Router();

// In-memory history of actions taken
const history: any[] = [];

router.get('/history', (req: Request, res: Response) => {
    res.json(history);
});

router.post('/action', async (req: Request, res: Response) => {
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
            const data = await ec2Client.send(new StopInstancesCommand({ InstanceIds: [resourceId] }));
            logEntry.status = data.StoppingInstances?.[0]?.CurrentState?.Name === 'stopping' ? 'SUCCESS' : 'RUNNING';
        } else if (actionType === 'START_EC2') {
            const data = await ec2Client.send(new StartInstancesCommand({ InstanceIds: [resourceId] }));
            logEntry.status = data.StartingInstances?.[0]?.CurrentState?.Name === 'pending' ? 'SUCCESS' : 'RUNNING';
        } else if (actionType === 'DELETE_EBS') {
            await ec2Client.send(new DeleteVolumeCommand({ VolumeId: resourceId }));
            logEntry.status = 'SUCCESS';
        } else {
            logEntry.status = 'FAILED';
            return res.status(400).json({ error: "Unsupported actionType" });
        }
        
        history.unshift(logEntry);
        res.json({ message: "Action executed successfully", log: logEntry });
        
    } catch (error: any) {
        logEntry.status = 'FAILED';
        history.unshift({ ...logEntry, error: error.message });
        res.status(500).json({ error: error.message, log: logEntry });
    }
});

// Utility to list testable unattached volumes and running EC2 arrays for the UI
router.get('/resources', async (req: Request, res: Response) => {
    try {
        const instancesCmd = new DescribeInstancesCommand({ 
            Filters: [{ Name: 'instance-state-name', Values: ['running', 'stopped'] }] 
        });
        const iData = await ec2Client.send(instancesCmd);
        
        let instances: any[] = [];
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
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

export default router;
