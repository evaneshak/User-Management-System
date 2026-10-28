window.ui = {
  message(id, text, good = false) { const el = document.getElementById(id); el.textContent = text; el.className = `message ${good ? 'good' : 'bad'}`; el.hidden = !text; },
  toast(text) { const el = document.getElementById('toast'); el.textContent = text; el.hidden = false; clearTimeout(this.timer); this.timer = setTimeout(() => { el.hidden = true; }, 4000); },
  loading(form, on) { const button = form.querySelector('button[type="submit"]'); button.disabled = on; button.dataset.original ||= button.textContent; button.textContent = on ? 'Working…' : button.dataset.original; },
  results(users) {
    const body = document.getElementById('result-body'); body.replaceChildren();
    const count = users.length; document.getElementById('result-count').textContent = `${count} user${count === 1 ? '' : 's'}`;
    document.getElementById('table-wrap').hidden = count === 0;
    const empty = document.getElementById('result-empty'); empty.hidden = count > 0; empty.textContent = 'No users matched this query. Try another value.';
    for (const user of users) {
      const tr = document.createElement('tr');
      const values = [user.username, user.firstname, user.lastname, `$${Number(user.salary).toFixed(2)}`, user.age, user.registerday, user.signintime || 'Never'];
      for (const value of values) { const td = document.createElement('td'); td.textContent = String(value); tr.append(td); }
      body.append(tr);
    }
  }
};
