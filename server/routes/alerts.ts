import { Router, Request, Response } from 'express';
import { alertService } from '../services/alertService';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const alerts = alertService.getAlerts();
        res.json(alerts);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

export default router;
