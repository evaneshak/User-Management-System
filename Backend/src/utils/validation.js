const { HttpError } = require('./errors');
const fail = (message) => { throw new HttpError(400, message); };
const text = (value, label, max = 50) => {
  if (typeof value !== 'string' || !value.trim()) fail(`${label} is required.`);
  const clean = value.trim();
  if (clean.length > max) fail(`${label} must be ${max} characters or fewer.`);
  return clean;
};
const username = (value) => {
  const clean = text(value, 'Userid');
  if (!/^[A-Za-z0-9_.-]{3,50}$/.test(clean)) fail('Userid must be 3–50 letters, numbers, underscores, periods, or hyphens.');
  return clean;
};
const money = (value, label = 'Salary') => {
  const raw = String(value ?? '');
  if (!/^(?:0|[1-9]\d{0,8})(?:\.\d{1,2})?$/.test(raw)) fail(`${label} must be between 0 and 999999999.99 with at most two decimals.`);
  return Number(raw).toFixed(2);
};
const age = (value, label = 'Age') => {
  const raw = String(value ?? '');
  if (!/^\d{1,3}$/.test(raw) || Number(raw) < 0 || Number(raw) > 120) fail(`${label} must be a whole number from 0 to 120.`);
  return Number(raw);
};
const range = (low, high, parser, label) => {
  const min = parser(low, `Minimum ${label}`), max = parser(high, `Maximum ${label}`);
  if (Number(min) > Number(max)) fail(`Minimum ${label} must not exceed maximum ${label}.`);
  return [min, max];
};
const registration = (body) => {
  const password = body.password;
  if (typeof password !== 'string' || password.length < 8 || password.length > 72) fail('Password must be 8–72 characters.');
  return {
    username: username(body.userid), password,
    firstname: text(body.firstname, 'First name'),
    lastname: text(body.lastname, 'Last name'),
    salary: money(body.salary), age: age(body.age)
  };
};
module.exports = { text, username, money, age, range, registration };
