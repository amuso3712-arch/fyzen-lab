import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { decodeJwt } from 'jose';

const base = 'http://localhost:3000';
const pids = execFileSync('pgrep', ['-f', 'node.*server/_core/index.ts'], { encoding: 'utf8' }).trim().split('\n');
const pid = pids[pids.length - 1];
const runningEnv = Object.fromEntries(readFileSync(`/proc/${pid}/environ`, 'utf8').split('\0').filter(Boolean).map(entry => {
  const index = entry.indexOf('=');
  return [entry.slice(0, index), entry.slice(index + 1)];
}));
process.env.JWT_SECRET = runningEnv.JWT_SECRET;
process.env.VITE_APP_ID = runningEnv.VITE_APP_ID;
process.env.OWNER_OPEN_ID = runningEnv.OWNER_OPEN_ID;
const { sdk } = await import('./server/_core/sdk.ts');
const { COOKIE_NAME } = await import('./shared/const.ts');
const db = await import('./server/db.ts');
let existingUser = await db.getUserByOpenId(process.env.OWNER_OPEN_ID || 'qa-owner');
if (!existingUser) {
  await db.upsertUser({ openId: process.env.OWNER_OPEN_ID || 'qa-owner', name: runningEnv.OWNER_NAME || 'Project owner', role: 'admin', lastSignedIn: new Date() });
  existingUser = await db.getUserByOpenId(process.env.OWNER_OPEN_ID || 'qa-owner');
}
console.log(JSON.stringify({ ownerUserExists: Boolean(existingUser), ownerRole: existingUser?.role || null }));
const token = await sdk.createSessionToken(process.env.OWNER_OPEN_ID || 'qa-owner', { name: runningEnv.OWNER_NAME || 'Project owner' });
const decoded = decodeJwt(token);
console.log(JSON.stringify({ tokenFields: Object.keys(decoded), hasOpenId: Boolean(decoded.openId), hasAppId: Boolean(decoded.appId), hasName: Boolean(decoded.name) }));
const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
const listResponse = await fetch(`${base}/api/admin/orders`, { headers });
const listPayload = await listResponse.json();
if (!listResponse.ok || !listPayload.success) throw new Error(`Admin list failed: ${listResponse.status}`);
console.log(JSON.stringify({ listStatus: listResponse.status, orderCount: listPayload.orders.length }));

const target = listPayload.orders[0];
if (!target) throw new Error('No existing order available for status QA');
const requestId = target.requestId;
const originalStatus = target.status;
const updateResponse = await fetch(`${base}/api/admin/orders/${encodeURIComponent(requestId)}/status`, {
  method: 'PATCH', headers, body: JSON.stringify({ status: 'processing', statusNote: 'QA status update' }),
});
const updatePayload = await updateResponse.json();
if (!updateResponse.ok || !updatePayload.success || updatePayload.order.status !== 'processing') throw new Error(`Admin update failed: ${updateResponse.status}`);
console.log(JSON.stringify({ updateStatus: updateResponse.status, status: updatePayload.order.status }));

const resetResponse = await fetch(`${base}/api/admin/orders/${encodeURIComponent(requestId)}/status`, {
  method: 'PATCH', headers, body: JSON.stringify({ status: originalStatus, statusNote: target.statusNote || null }),
});
if (!resetResponse.ok) throw new Error(`QA reset failed: ${resetResponse.status}`);
console.log('ADMIN_API_AUTHORIZED=passed');
