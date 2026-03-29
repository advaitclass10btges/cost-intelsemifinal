import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '.env') });

import { CostExplorerClient } from "@aws-sdk/client-cost-explorer";
import { CloudWatchClient } from "@aws-sdk/client-cloudwatch";
import { EC2Client } from "@aws-sdk/client-ec2";
import { ComputeOptimizerClient } from "@aws-sdk/client-compute-optimizer";
import { STSClient } from "@aws-sdk/client-sts";
import { ResourceGroupsTaggingAPIClient } from "@aws-sdk/client-resource-groups-tagging-api";

const region = process.env.AWS_REGION || 'us-east-1';

// AWS SDK v3 clients automatically use AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY from process.env
const clientConfig = { region };

export const ceClient = new CostExplorerClient(clientConfig);
export const cwClient = new CloudWatchClient(clientConfig);
export const ec2Client = new EC2Client(clientConfig);
export const optimizeClient = new ComputeOptimizerClient(clientConfig);
export const stsClient = new STSClient(clientConfig);
export const rgClient = new ResourceGroupsTaggingAPIClient(clientConfig);
