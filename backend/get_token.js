const sqlite3 = require('better-sqlite3');
const db = sqlite3('.tmp/data.db');
const row = db.prepare("SELECT * FROM strapi_api_tokens LIMIT 1", []).get();
console.log(row ? row.access_key : 'NO_TOKEN');
