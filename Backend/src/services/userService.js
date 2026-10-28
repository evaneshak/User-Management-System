const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const { HttpError } = require('../utils/errors');
const columns = 'username, firstname, lastname, salary, age, registerday, signintime';
const order = ' ORDER BY registerday ASC, username ASC LIMIT 200';
const escapeLike = (value) => value.replace(/[\\%_]/g, '\\$&');
const list = async (sql, params = [], db = pool) => {
  const [rows] = await db.execute(sql, params);
  return rows;
};
async function register(input, db = pool) {
  const hash = await bcrypt.hash(input.password, 12);
  try {
    await db.execute('INSERT INTO Users (username, password_hash, firstname, lastname, salary, age, registerday) VALUES (?, ?, ?, ?, ?, ?, CURDATE())', [input.username, hash, input.firstname, input.lastname, input.salary, input.age]);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') throw new HttpError(409, 'That userid is already registered.');
    throw error;
  }
  return { userid: input.username, message: 'Registration complete.' };
}
async function login(userid, password, db = pool) {
  const [rows] = await db.execute('SELECT username, password_hash FROM Users WHERE username = ?', [userid]);
  const valid = rows.length === 1 && await bcrypt.compare(password, rows[0].password_hash);
  if (!valid) throw new HttpError(401, 'Invalid userid or password.');
  await db.execute('UPDATE Users SET signintime = NOW() WHERE username = ?', [userid]);
  return { userid, message: 'Credentials verified. No persistent login session is created.' };
}
async function names(firstname, lastname, db = pool) {
  const filters = [], params = [];
  if (firstname) { filters.push("firstname LIKE ? ESCAPE '\\\\'"); params.push(`%${escapeLike(firstname)}%`); }
  if (lastname) { filters.push("lastname LIKE ? ESCAPE '\\\\'"); params.push(`%${escapeLike(lastname)}%`); }
  return list(`SELECT ${columns} FROM Users WHERE ${filters.join(' AND ')}${order}`, params, db);
}
const byUserid = (userid, db = pool) => list(`SELECT ${columns} FROM Users WHERE username = ?${order}`, [userid], db);
const salaries = (min, max, db = pool) => list(`SELECT ${columns} FROM Users WHERE salary BETWEEN ? AND ?${order}`, [min, max], db);
const ages = (min, max, db = pool) => list(`SELECT ${columns} FROM Users WHERE age BETWEEN ? AND ?${order}`, [min, max], db);
async function reference(kind, userid, db = pool) {
  const [referenceRows] = await db.execute('SELECT registerday FROM Users WHERE username = ?', [userid]);
  if (!referenceRows.length) throw new HttpError(404, `Reference userid '${userid}' was not found.`);
  const predicate = kind === 'after' ? 'registerday > ?' : 'registerday = ?';
  return list(`SELECT ${columns} FROM Users WHERE ${predicate}${order}`, [referenceRows[0].registerday], db);
}
const never = (db = pool) => list(`SELECT ${columns} FROM Users WHERE signintime IS NULL${order}`, [], db);
const today = (db = pool) => list(`SELECT ${columns} FROM Users WHERE registerday = CURDATE()${order}`, [], db);
module.exports = { register, login, names, byUserid, salaries, ages, reference, never, today, escapeLike };
