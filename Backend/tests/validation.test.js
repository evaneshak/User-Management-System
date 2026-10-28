const test = require('node:test');
const assert = require('node:assert/strict');
const v = require('../src/utils/validation');
test('registration validates required fields and salary/age ranges', () => {
  const good = { userid: 'ava2026', password: 'StrongDemo123!', firstname: 'Ava', lastname: 'Stone', salary: '59000.25', age: '26' };
  assert.equal(v.registration(good).username, 'ava2026');
  for (const field of Object.keys(good)) assert.throws(() => v.registration({ ...good, [field]: '' }));
  assert.throws(() => v.registration({ ...good, salary: '-1' }));
  assert.throws(() => v.registration({ ...good, age: '121' }));
});
test('range endpoints and userid reject unsafe values', () => {
  assert.deepEqual(v.range('24','35',v.age,'age'), [24,35]);
  assert.throws(() => v.range('35','24',v.age,'age'));
  assert.throws(() => v.range('100','20',v.money,'salary'));
  assert.throws(() => v.username("' OR '1'='1"));
});
