window.api = {
  async request(path, options = {}) {
    let response;
    try { response = await fetch(window.APP_CONFIG.apiBase + path, options); }
    catch { throw new Error('Cannot reach the API. Start Backend with npm start, then check http://localhost:5050/api/health.'); }
    let data;
    try { data = await response.json(); } catch { throw new Error('The API returned an unreadable response. Check the Backend terminal.'); }
    if (!response.ok) throw new Error(data.error || `Request failed (${response.status}).`);
    return data;
  },
  post(path, body) { return this.request(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); },
  get(path, params = {}) { const query = new URLSearchParams(params).toString(); return this.request(path + (query ? `?${query}` : '')); }
};
