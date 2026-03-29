import { Server } from 'socket.io';
import { ceClient, ec2Client } from '../lib/aws';
import { GetCostAndUsageCommand } from '@aws-sdk/client-cost-explorer';
import { DescribeVolumesCommand, DescribeInstancesCommand } from '@aws-sdk/client-ec2';
import NodeCache from 'node-cache';

const alertCache = new NodeCache({ stdTTL: 86400 }); // Store alerts for 24h

export interface Alert {
  id: string;
  type: 'cost' | 'idle' | 'anomaly' | 'savings';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
  resourceId?: string;
  estimatedSavings?: number;
  read: boolean;
}

class AlertService {
  private io: Server | null = null;
  private interval: NodeJS.Timeout | null = null;

  setIo(io: Server) {
    this.io = io;
  }

  async startScanning() {
    if (this.interval) return;
    
    console.log('Starting real-time alert scanner...');
    
    // Initial scan
    this.performScan();

    // Scan every 5 minutes
    this.interval = setInterval(() => {
      this.performScan();
    }, 5 * 60 * 1000);
  }

  async performScan() {
    try {
      console.log('Scanning AWS for alerts...');
      const alerts: Alert[] = [];

      // 1. Check for Cost Spikes (Compare last 24h vs average)
      const costAlerts = await this.checkCostSpikes();
      alerts.push(...costAlerts);

      // 2. Check for Idle EC2 Instances
      const idleAlerts = await this.checkIdleInstances();
      alerts.push(...idleAlerts);

      // 3. Check for Zombie EBS Volumes
      const zombieAlerts = await this.checkZombieVolumes();
      alerts.push(...zombieAlerts);

      // Process and Emit new alerts
      for (const alert of alerts) {
        const cacheKey = `alert_${alert.id}`;
        if (!alertCache.has(cacheKey)) {
          alertCache.set(cacheKey, alert);
          this.emitAlert(alert);
        }
      }
    } catch (error) {
      console.error('Error during alert scan:', error);
    }
  }

  private async checkCostSpikes(): Promise<Alert[]> {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const dayBefore = new Date();
    dayBefore.setDate(today.getDate() - 2);

    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    try {
      const data = await ceClient.send(new GetCostAndUsageCommand({
        TimePeriod: { Start: formatDate(dayBefore), End: formatDate(today) },
        Granularity: 'DAILY',
        Metrics: ['UnblendedCost']
      }));

      const results = data.ResultsByTime || [];
      if (results.length >= 2) {
        const cost1 = parseFloat(results[0].Total?.UnblendedCost?.Amount || '0');
        const cost2 = parseFloat(results[1].Total?.UnblendedCost?.Amount || '0');

        if (cost2 > cost1 * 1.5 && cost2 > 10) { // 50% spike and >$10
          return [{
            id: `spike_${formatDate(yesterday)}`,
            type: 'cost',
            title: 'Cost Spike Detected',
            description: `Daily spend jumped from $${cost1.toFixed(2)} to $${cost2.toFixed(2)}`,
            severity: 'high',
            timestamp: new Date().toISOString(),
            read: false
          }];
        }
      }
    } catch (e) {
      console.warn('Cost spike check failed:', e);
    }
    return [];
  }

  private async checkIdleInstances(): Promise<Alert[]> {
    try {
        const data = await ec2Client.send(new DescribeInstancesCommand({
            Filters: [{ Name: 'instance-state-name', Values: ['running'] }]
        }));

        const instances = data.Reservations?.flatMap(r => r.Instances || []) || [];
        // Real logic would check CloudWatch CPU, but for now we tag old ones
        const idle = instances.filter(i => {
            const launchTime = new Date(i.LaunchTime || 0);
            const ageDays = (new Date().getTime() - launchTime.getTime()) / (1000 * 3600 * 24);
            return ageDays > 30; // Mock idle: running for > 30 days
        });

        return idle.slice(0, 2).map(inst => ({
            id: `idle_${inst.InstanceId}`,
            type: 'idle',
            title: 'Idle Instance Recommendation',
            description: `Instance ${inst.InstanceId} (${inst.InstanceType}) has been running for over 30 days.`,
            severity: 'medium',
            resourceId: inst.InstanceId,
            timestamp: new Date().toISOString(),
            read: false
        }));
    } catch (e) {
        return [];
    }
  }

  private async checkZombieVolumes(): Promise<Alert[]> {
    try {
        const data = await ec2Client.send(new DescribeVolumesCommand({
            Filters: [{ Name: 'status', Values: ['available'] }]
        }));

        const volumes = data.Volumes || [];
        return volumes.slice(0, 3).map(vol => ({
            id: `zombie_${vol.VolumeId}`,
            type: 'savings',
            title: 'Unattached EBS Volume',
            description: `Unattached volume ${vol.VolumeId} (${vol.Size}GB) is incurring costs.`,
            severity: 'low',
            resourceId: vol.VolumeId,
            estimatedSavings: (vol.Size || 0) * 0.1,
            timestamp: new Date().toISOString(),
            read: false
        }));
    } catch (e) {
        return [];
    }
  }

  private emitAlert(alert: Alert) {
    if (this.io) {
      console.log('Pushing real-time alert:', alert.title);
      this.io.emit('new_alert', alert);
    }
  }

  getAlerts(): Alert[] {
    const keys = alertCache.keys();
    return keys.map(k => alertCache.get(k) as Alert).sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }
}

export const alertService = new AlertService();
