const modes = [
  { n: '03', title: 'Name search', description: 'Find first and/or last names with literal partial matches. Enter at least one.', path: '/users/search/names', fields: [['firstname','First name','e.g. Ma'],['lastname','Last name','e.g. Chen']] },
  { n: '04', title: 'Find by userid', description: 'Return the user whose username exactly matches this userid.', path: '/users/search/userid', fields: [['userid','Userid','e.g. john']] },
  { n: '05', title: 'Salary range', description: 'Find salaries between the minimum and maximum, including both endpoints.', path: '/users/search/salary', fields: [['min','Minimum salary','e.g. 54000'],['max','Maximum salary','e.g. 72000.50']] },
  { n: '06', title: 'Age range', description: 'Find ages between the minimum and maximum, including both endpoints.', path: '/users/search/age', fields: [['min','Minimum age','e.g. 24'],['max','Maximum age','e.g. 35']] },
  { n: '07', title: 'Registered after', description: 'Find users with registerday strictly later than the reference userid’s date. Same-day users do not count.', path: '/users/search/after', fields: [['userid','Reference userid','john']] },
  { n: '08', title: 'Never signed in', description: 'Find users whose signintime is SQL NULL.', path: '/users/search/never', fields: [] },
  { n: '09', title: 'Same registration day', description: 'Find everyone registered on the reference userid’s day, including that user.', path: '/users/search/same-day', fields: [['userid','Reference userid','john']] },
  { n: '10', title: 'Registered today', description: 'Find users registered on MySQL’s current date (CURDATE in the database server timezone).', path: '/users/search/today', fields: [] }
];
let activeMode = 0;
function showPage(page) {
  document.querySelectorAll('.page').forEach(el => el.classList.toggle('active', el.id === page));
  document.querySelectorAll('.nav').forEach(el => el.classList.toggle('active', el.dataset.page === page));
}
function selectMode(index) {
  activeMode = index; const mode = modes[index];
  document.querySelectorAll('.mode').forEach((el, i) => { el.classList.toggle('active', i === index); el.setAttribute('aria-selected', i === index); });
  document.getElementById('query-num').textContent = mode.n;
  document.getElementById('query-title').textContent = mode.title;
  document.getElementById('query-description').textContent = mode.description;
  const fields = document.getElementById('search-fields'); fields.replaceChildren();
  for (const [name, labelText, placeholder] of mode.fields) {
    const label = document.createElement('label'); label.textContent = labelText;
    const input = document.createElement('input'); input.name = name; input.placeholder = placeholder; input.autocomplete = 'off';
    if (name === 'min' || name === 'max') { input.type = 'number'; input.min = '0'; input.step = mode.n === '06' ? '1' : '0.01'; }
    if (name === 'userid' && (mode.n === '07' || mode.n === '09')) input.value = 'john';
    label.append(input); fields.append(label);
  }
  ui.message('search-message', '');
  document.getElementById('result-count').textContent = '0 users';
  document.getElementById('table-wrap').hidden = true;
  const empty = document.getElementById('result-empty'); empty.hidden = false; empty.textContent = 'Run a query to view user records.';
}
async function health() {
  const dot = document.getElementById('health-dot'); const label = document.getElementById('health-label');
  try { const data = await api.get('/health'); dot.className = 'dot on'; label.textContent = `API + database ${data.database}`; }
  catch (error) { dot.className = 'dot off'; label.textContent = error.message.includes('Cannot reach') ? 'API offline · start Backend' : 'Database offline · check XAMPP'; }
}
document.querySelectorAll('.nav').forEach(el => el.addEventListener('click', () => showPage(el.dataset.page)));
document.getElementById('health-retry').addEventListener('click', health);
const modeList = document.getElementById('mode-list');
modes.forEach((mode, index) => {
  const button = document.createElement('button'); button.type = 'button'; button.className = 'mode'; button.setAttribute('role', 'tab');
  const num = document.createElement('span'); num.className = 'mode-num'; num.textContent = mode.n;
  const title = document.createElement('span'); title.textContent = mode.title;
  button.append(num, title); button.addEventListener('click', () => selectMode(index)); modeList.append(button);
});
selectMode(0); health();
document.getElementById('search-form').addEventListener('submit', async (event) => {
  event.preventDefault(); const form = event.currentTarget; const mode = modes[activeMode]; const params = Object.fromEntries(new FormData(form));
  for (const key of Object.keys(params)) params[key] = params[key].trim();
  if (mode.n === '03' && !params.firstname && !params.lastname) return ui.message('search-message', 'Enter a first name, last name, or both.');
  if (['04','05','06'].includes(mode.n) && Object.values(params).some(v => !v)) return ui.message('search-message', 'Fill in every field for this query.');
  if (['07','09'].includes(mode.n) && !params.userid) params.userid = 'john';
  ui.message('search-message', ''); ui.loading(form, true);
  try { const data = await api.get(mode.path, params); ui.results(data.users); ui.toast(`Query ${mode.n} complete: ${data.count} result${data.count === 1 ? '' : 's'}.`); }
  catch (error) { ui.results([]); document.getElementById('result-empty').textContent = 'Query did not run.'; ui.message('search-message', error.message); }
  finally { ui.loading(form, false); }
});
document.getElementById('register-form').addEventListener('submit', async (event) => {
  event.preventDefault(); const form = event.currentTarget; const body = Object.fromEntries(new FormData(form));
  if (!form.reportValidity()) return;
  ui.message('register-message', ''); ui.loading(form, true);
  try { const data = await api.post('/users/register', body); ui.message('register-message', `Created ${data.userid}. Registration date is today.`, true); ui.toast('User registered successfully.'); form.reset(); }
  catch (error) { ui.message('register-message', error.message); }
  finally { ui.loading(form, false); }
});
document.getElementById('login-form').addEventListener('submit', async (event) => {
  event.preventDefault(); const form = event.currentTarget; if (!form.reportValidity()) return;
  ui.message('login-message', ''); ui.loading(form, true);
  try { const data = await api.post('/auth/login', Object.fromEntries(new FormData(form))); ui.message('login-message', `Credentials verified for ${data.userid}. Last sign-in updated. No session was created.`, true); ui.toast('Sign-in check succeeded.'); form.reset(); }
  catch (error) { ui.message('login-message', error.message); }
  finally { ui.loading(form, false); }
});
