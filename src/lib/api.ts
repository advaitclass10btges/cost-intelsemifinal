export async function fetchCostMonthly() {
  const res = await fetch('/api/cost/monthly');
  if (!res.ok) throw new Error('Failed to load monthly cost');
  return res.json();
}

export async function fetchCostTrend() {
  const res = await fetch('/api/cost/trend');
  if (!res.ok) throw new Error('Failed to load cost trend');
  return res.json();
}

export async function fetchCostBreakdown() {
  const res = await fetch('/api/cost/breakdown');
  if (!res.ok) throw new Error('Failed to load cost breakdown');
  return res.json();
}

export async function fetchCostForecast() {
  const res = await fetch('/api/cost/forecast');
  if (!res.ok) throw new Error('Failed to load cost forecast');
  return res.json();
}

export async function fetchIntelAnomalies() {
  const res = await fetch('/api/intelligence/anomalies');
  if (!res.ok) throw new Error('Failed to load anomalies');
  return res.json();
}

export async function fetchIntelMetrics() {
  const res = await fetch('/api/intelligence/metrics');
  if (!res.ok) throw new Error('Failed to load metrics');
  return res.json();
}

export async function fetchIntelInsights() {
  const res = await fetch('/api/intelligence/insights');
  if (!res.ok) throw new Error('Failed to load insights');
  return res.json();
}

export async function fetchOptRecommendations() {
  const res = await fetch('/api/optimization/recommendations');
  if (!res.ok) throw new Error('Failed to load recommendations');
  return res.json();
}

export async function fetchOptSavings() {
  const res = await fetch('/api/optimization/savings');
  if (!res.ok) throw new Error('Failed to load savings');
  return res.json();
}

export async function executeAction(actionType: string, resourceId: string, resourceType: string) {
  const res = await fetch('/api/execute/action', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ actionType, resourceId, resourceType })
  });
  if (!res.ok) throw new Error('Execution failed');
  return res.json();
}

export async function fetchExecutionHistory() {
  const res = await fetch('/api/execute/history');
  if (!res.ok) throw new Error('Failed to load history');
  return res.json();
}

export async function fetchExecutionResources() {
  const res = await fetch('/api/execute/resources');
  if (!res.ok) throw new Error('Failed to load resources');
  return res.json();
}

export async function fetchPlatformStatus() {
  const res = await fetch('/api/platform/status');
  if (!res.ok) throw new Error('Failed to load platform status');
  return res.json();
}

export async function fetchPlatformAccounts() {
  const res = await fetch('/api/platform/accounts');
  if (!res.ok) throw new Error('Failed to load platform accounts');
  return res.json();
}
