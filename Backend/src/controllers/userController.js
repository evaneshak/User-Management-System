const service = require('../services/userService');
const v = require('../utils/validation');
const { HttpError } = require('../utils/errors');
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res)).catch(next);
const send = (res, rows) => res.json({ count: rows.length, users: rows });
const register = wrap(async (req, res) => {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) throw new HttpError(400, 'A JSON registration object is required.');
  res.status(201).json(await service.register(v.registration(req.body)));
});
const names = wrap(async (req, res) => {
  const first = req.query.firstname ? v.text(req.query.firstname, 'First name') : '';
  const last = req.query.lastname ? v.text(req.query.lastname, 'Last name') : '';
  if (!first && !last) throw new HttpError(400, 'Enter a first name, last name, or both.');
  send(res, await service.names(first, last));
});
const byUserid = wrap(async (req, res) => send(res, await service.byUserid(v.username(req.query.userid))));
const salaries = wrap(async (req, res) => {
  const [min, max] = v.range(req.query.min, req.query.max, v.money, 'salary');
  send(res, await service.salaries(min, max));
});
const ages = wrap(async (req, res) => {
  const [min, max] = v.range(req.query.min, req.query.max, v.age, 'age');
  send(res, await service.ages(min, max));
});
const reference = (kind) => wrap(async (req, res) => send(res, await service.reference(kind, v.username(req.query.userid || 'john'))));
const never = wrap(async (_req, res) => send(res, await service.never()));
const today = wrap(async (_req, res) => send(res, await service.today()));
module.exports = { register, names, byUserid, salaries, ages, reference, never, today };
