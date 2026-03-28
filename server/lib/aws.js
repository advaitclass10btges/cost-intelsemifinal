"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rgClient = exports.stsClient = exports.optimizeClient = exports.ec2Client = exports.cwClient = exports.ceClient = void 0;
const client_cost_explorer_1 = require("@aws-sdk/client-cost-explorer");
const client_cloudwatch_1 = require("@aws-sdk/client-cloudwatch");
const client_ec2_1 = require("@aws-sdk/client-ec2");
const client_compute_optimizer_1 = require("@aws-sdk/client-compute-optimizer");
const client_sts_1 = require("@aws-sdk/client-sts");
const client_resource_groups_tagging_api_1 = require("@aws-sdk/client-resource-groups-tagging-api");
const region = process.env.AWS_REGION || 'us-east-1';
// AWS SDK v3 clients automatically use AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY from process.env
const clientConfig = { region };
exports.ceClient = new client_cost_explorer_1.CostExplorerClient(clientConfig);
exports.cwClient = new client_cloudwatch_1.CloudWatchClient(clientConfig);
exports.ec2Client = new client_ec2_1.EC2Client(clientConfig);
exports.optimizeClient = new client_compute_optimizer_1.ComputeOptimizerClient(clientConfig);
exports.stsClient = new client_sts_1.STSClient(clientConfig);
exports.rgClient = new client_resource_groups_tagging_api_1.ResourceGroupsTaggingAPIClient(clientConfig);
//# sourceMappingURL=aws.js.map