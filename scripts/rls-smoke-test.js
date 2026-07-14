#!/usr/bin/env node
/**
 * RLS smoke test — automates the manual two-account test used to find
 * and verify the trip_members bugs (see supabase/migrations 0005/0006).
 * Creates two real, disposable accounts via Mailinator's public inbox
 * (no API key needed — anyone can read a Mailinator inbox, which is
 * exactly why it's fine for disposable test accounts and never for
 * anything real), confirms them via the actual signup email, and
 * exercises the trip-sharing flow against a live Supabase project.
 *
 * Usage:
 *   SUPABASE_URL=... SUPABASE_ANON_KEY=... node scripts/rls-smoke-test.js
 *
 * Defaults to this project's production Supabase instance if the env
 * vars aren't set — point it at a staging project instead once one
 * exists, by setting SUPABASE_URL/SUPABASE_ANON_KEY to the staging
 * project's values.
 *
 * Cleans up everything it creates. If it's interrupted mid-run, the
 * leftover trips are prefixed `smoketest-` and safe to delete manually.
 */

const SB_URL = process.env.SUPABASE_URL || 'https://ocwqpeyfxsovkqbmzlgh.supabase.co';
const SB_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_xS8gLHbIxrR62lI178O3ag_DtXp66Rv';

const results = [];
function check(name, condition, detail) {
  results.push({ name, pass: !!condition, detail });
  console.log((condition ? '  ✓ ' : '  ✗ ') + name + (detail ? ' — ' + detail : ''));
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function sbFetch(path, opts = {}) {
  const res = await fetch(`${SB_URL}${path}`, {
    ...opts,
    headers: { apikey: SB_KEY, 'Content-Type': 'application/json', ...opts.headers },
  });
  const text = await res.text();
  let json = null;
  try { json = text ? JSON.parse(text) : null; } catch { /* non-JSON response */ }
  return { status: res.status, ok: res.ok, json, text };
}

async function signupAndConfirm(label) {
  const inbox = `smoketest-${label}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const email = `${inbox}@mailinator.com`;
  const password = 'SmokeTest123!';

  const signup = await sbFetch('/auth/v1/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password, data: { name: `Smoke ${label}`, gender: 'other' } }),
  });
  if (!signup.ok) throw new Error(`signup failed for ${label}: ${signup.text}`);

  // Fast path: if "Confirm email" is off (e.g. a staging project set up for
  // quick automated testing), signup itself returns a session — no email
  // round-trip needed at all.
  if (signup.json?.access_token) {
    return { email, token: signup.json.access_token, userId: signup.json.user.id };
  }

  // Otherwise poll Mailinator for the confirmation email (usually arrives in a few seconds)
  let link = null;
  for (let attempt = 0; attempt < 12 && !link; attempt++) {
    await sleep(2500);
    try {
      const inboxRes = await fetch(`https://mailinator.com/api/v2/domains/public/inboxes/${inbox}`);
      if (!inboxRes.ok) continue;
      const inboxData = await inboxRes.json();
      const msg = (inboxData.msgs || [])[0];
      if (!msg) continue;
      const msgRes = await fetch(`https://mailinator.com/api/v2/domains/public/inboxes/${inbox}/messages/${msg.id}`);
      if (!msgRes.ok) continue;
      const msgData = await msgRes.json();
      for (const part of msgData.parts || []) {
        const m = (part.body || '').match(/https:\/\/[^\s"<>]+\/auth\/v1\/verify\?token=[^\s"<>&]+&type=signup&redirect_to=[^\s"<>&\]]+/);
        if (m) { link = m[0].replace(/&amp;/g, '&'); break; }
      }
    } catch {
      // Transient Mailinator hiccup — just retry on the next loop iteration.
    }
  }
  if (!link) throw new Error(`confirmation email never arrived for ${label}`);

  await fetch(link, { redirect: 'manual' });

  const login = await sbFetch('/auth/v1/token?grant_type=password', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (!login.ok || !login.json?.access_token) throw new Error(`login failed for ${label} post-confirm: ${login.text}`);

  return { email, token: login.json.access_token, userId: login.json.user.id };
}

async function main() {
  console.log(`Running RLS smoke test against ${SB_URL}\n`);
  console.log('Creating two disposable test accounts (Mailinator)...');
  const a = await signupAndConfirm('a');
  const b = await signupAndConfirm('b');
  console.log(`  A: ${a.email}\n  B: ${b.email}\n`);

  const sharedTripId = `smoketest-shared-${Date.now()}`;
  const privateTripId = `smoketest-private-${Date.now()}`;
  const inviteCode = `SMOK-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

  console.log('Setting up trips...');
  await sbFetch('/rest/v1/trips', {
    method: 'POST',
    headers: { Authorization: `Bearer ${a.token}`, Prefer: 'return=minimal' },
    body: JSON.stringify({ id: sharedTripId, user_id: a.userId, invite_code: inviteCode, created_at: new Date().toISOString(), data: { destination: 'Smoke Test City' } }),
  });
  await sbFetch('/rest/v1/trips', {
    method: 'POST',
    headers: { Authorization: `Bearer ${a.token}`, Prefer: 'return=minimal' },
    body: JSON.stringify({ id: privateTripId, user_id: a.userId, created_at: new Date().toISOString(), data: { destination: 'Private City' } }),
  });

  console.log('\nRunning assertions...');

  const preview = await sbFetch('/rest/v1/rpc/preview_trip_by_code', {
    method: 'POST', body: JSON.stringify({ p_invite_code: inviteCode }),
  });
  check('preview_trip_by_code works anonymously', preview.ok && preview.json?.[0]?.destination === 'Smoke Test City');

  const join = await sbFetch('/rest/v1/rpc/join_trip_by_code', {
    method: 'POST', headers: { Authorization: `Bearer ${b.token}` },
    body: JSON.stringify({ p_invite_code: inviteCode }),
  });
  check('join_trip_by_code succeeds for a real invite code', join.ok);

  const bTrips = await sbFetch('/rest/v1/trips?select=id', { headers: { Authorization: `Bearer ${b.token}` } });
  check(
    "joined trip appears in the joiner's own trips query (the original bug)",
    bTrips.ok && bTrips.json?.some(t => t.id === sharedTripId)
  );

  const bWriteShared = await sbFetch('/rest/v1/packing_state', {
    method: 'POST',
    headers: { Authorization: `Bearer ${b.token}`, Prefer: 'return=minimal' },
    body: JSON.stringify({ trip_id: sharedTripId, user_id: b.userId, item_state: {}, dismissed: [], custom_items: {} }),
  });
  check('member can write packing_state for a trip they joined', bWriteShared.ok);

  const bWritePrivate = await sbFetch('/rest/v1/packing_state', {
    method: 'POST',
    headers: { Authorization: `Bearer ${b.token}`, Prefer: 'return=minimal' },
    body: JSON.stringify({ trip_id: privateTripId, user_id: b.userId, item_state: {}, dismissed: [], custom_items: {} }),
  });
  check('non-member is BLOCKED from writing packing_state for a trip they are not on', !bWritePrivate.ok);

  const directMembersQuery = await sbFetch('/rest/v1/trip_members?limit=1', { headers: { Authorization: `Bearer ${a.token}` } });
  check('direct trip_members query does not hit infinite recursion', directMembersQuery.ok);

  console.log('\nCleaning up...');
  await sbFetch(`/rest/v1/packing_state?trip_id=eq.${sharedTripId}&user_id=eq.${b.userId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${b.token}` } });
  if (bWritePrivate.ok) {
    await sbFetch(`/rest/v1/packing_state?trip_id=eq.${privateTripId}&user_id=eq.${b.userId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${b.token}` } });
  }
  await sbFetch(`/rest/v1/trips?id=eq.${sharedTripId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${a.token}` } });
  await sbFetch(`/rest/v1/trips?id=eq.${privateTripId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${a.token}` } });

  const failed = results.filter(r => !r.pass);
  console.log(`\n${results.length - failed.length}/${results.length} checks passed.`);
  if (failed.length) {
    console.log('\nFAILED:');
    failed.forEach(f => console.log('  - ' + f.name));
    process.exitCode = 1;
  }
  console.log('\nNote: the two test accounts (smoketest-a-*/smoketest-b-*@mailinator.com) remain in auth.users — this script has no service-role access to delete them. Clean up periodically via Supabase Dashboard → Authentication → Users.');
}

main().catch(e => { console.error('\nSMOKE TEST CRASHED:', e.message); process.exitCode = 1; });
