const test = require('node:test');
const assert = require('node:assert/strict');
const bcrypt = require('bcryptjs');
const s = require('../src/services/userService');
const mock = (...replies) => { const calls = []; return { calls, async execute(sql, params) { calls.push({sql, params}); return [replies.shift() || []]; } }; };
test('failed password never updates signintime', async () => {
  const db = mock([{username:'john', password_hash: await bcrypt.hash('DemoPass123!', 4)}]);
  await assert.rejects(s.login('john','wrong',db), {status:401});
  assert.equal(db.calls.length, 1);
  assert.deepEqual(db.calls[0].params, ['john']);
});
test('successful password updates signintime with bound userid', async () => {
  const db = mock([{username:'john', password_hash: await bcrypt.hash('DemoPass123!', 4)}], []);
  const result = await s.login('john','DemoPass123!',db);
  assert.equal(result.userid,'john'); assert.equal(db.calls.length,2);
  assert.deepEqual(db.calls[1].params,['john']);
});
test('duplicate registration produces 409', async () => {
  const db = { execute: async () => { const e = Error('duplicate'); e.code='ER_DUP_ENTRY'; throw e; } };
  await assert.rejects(s.register({username:'john',password:'DemoPass123!',firstname:'John',lastname:'Carter',salary:'65000.00',age:30},db), {status:409});
});
test('literal wildcard search uses bound escaped LIKE values', async () => {
  const db = mock([]); await s.names('A%_\\','',db);
  assert.deepEqual(db.calls[0].params,['%A\\%\\_\\\\%']);
  assert.match(db.calls[0].sql,/ESCAPE/);
});
test('after and same day use the reference date and stable order', async () => {
  const db = mock([{registerday:'2026-10-20'}],[],[{registerday:'2026-10-20'}],[]);
  await s.reference('after','john',db); await s.reference('same-day','john',db);
  assert.match(db.calls[1].sql,/registerday > \?/);
  assert.match(db.calls[3].sql,/registerday = \?/);
  assert.deepEqual(db.calls[1].params,['2026-10-20']);
  assert.match(db.calls[1].sql,/ORDER BY registerday ASC, username ASC/);
});
test('missing reference, NULL signins, and database today', async () => {
  await assert.rejects(s.reference('after','missing',mock([])),{status:404});
  const db = mock([],[]); await s.never(db); await s.today(db);
  assert.match(db.calls[0].sql,/signintime IS NULL/);
  assert.match(db.calls[1].sql,/CURDATE\(\)/);
});
