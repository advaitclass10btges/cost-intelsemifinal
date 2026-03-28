import NodeCache from 'node-cache';
export const cache = new NodeCache({ stdTTL: 120 }); // cache for 2 minutes to save AWS cost
