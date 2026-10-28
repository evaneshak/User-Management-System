// DEMO DATABASE ONLY. The shared demo password is intentionally shown for class use.
const path = require('node:path');
require(path.resolve(__dirname, '../Backend/node_modules/dotenv')).config({ path: path.resolve(__dirname, '../Backend/.env') });
const bcrypt = require(path.resolve(__dirname, '../Backend/node_modules/bcryptjs'));
const pool = require('../Backend/src/config/db');
const accounts = [
  ['john', 'John', 'Carter', '65000.00', 30, -7, null],
  ['maya', 'Maya', 'Chen', '72000.50', 28, -7, null],
  ['nina', 'Nina', 'Patel', '54000.00', 24, -3, null],
  ['omar', 'Omar', 'Reed', '88000.00', 41, -1, -1],
  ['liam', 'Liam', 'Brooks', '46000.25', 22, 0, null],
  ['zoe', 'Zoe', 'Diaz', '61000.00', 35, 0, null]
];
async function main() {
  if (process.env.DB_NAME !== 'web_app' || process.env.CONFIRM_DEMO_SEED !== 'YES') {
    throw new Error('Seed is restricted to DB_NAME=web_app and CONFIRM_DEMO_SEED=YES. Use a dedicated demo database.');
  }
  const [existing] = await pool.execute('SELECT username FROM Users WHERE username IN (?, ?, ?, ?, ?, ?)', accounts.map(a => a[0]));
  if (existing.length) throw new Error(`Seed stopped: existing demo userid(s): ${existing.map(r => r.username).join(', ')}. No records changed.`);
  const hash = await bcrypt.hash('DemoPass123!', 12);
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    for (const [username, firstname, lastname, salary, age, days, signedDays] of accounts) {
      await conn.execute(
        'INSERT INTO Users (username, password_hash, firstname, lastname, salary, age, registerday, signintime) VALUES (?, ?, ?, ?, ?, ?, DATE_ADD(CURDATE(), INTERVAL ? DAY), CASE WHEN ? IS NULL THEN NULL ELSE DATE_ADD(DATE_ADD(CURDATE(), INTERVAL ? DAY), INTERVAL 9 HOUR) END)',
        [username, hash, firstname, lastname, salary, age, days, signedDays, signedDays]
      );
    }
    await conn.commit();
    console.log('Inserted 6 demo users. Password for all: DemoPass123!');
  } catch (error) { await conn.rollback(); throw error; }
  finally { conn.release(); await pool.end(); }
}
main().catch(async (error) => { console.error(error.message); await pool.end(); process.exitCode = 1; });
