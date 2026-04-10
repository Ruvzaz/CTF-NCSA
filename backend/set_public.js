const sqlite3 = require('better-sqlite3');
const db = sqlite3('.tmp/data.db');

// Get the 'Public' role ID. It's usually name = 'Public' and type = 'public'
const publicRole = db.prepare("SELECT id FROM up_roles WHERE type='public'").get();
const roleId = publicRole.id;

// The controllers we want to make public:
const permissions = [
  { action: 'api::challenge.challenge.find' },
  { action: 'api::challenge.challenge.findOne' },
  { action: 'api::event.event.find' },
  { action: 'api::event.event.findOne' },
  { action: 'api::news.news.find' },
  { action: 'api::news.news.findOne' },
  { action: 'api::writeup.writeup.find' },
  { action: 'api::writeup.writeup.findOne' },
  { action: 'api::category.category.find' },
  { action: 'api::category.category.findOne' }
];

const insertMeta = db.prepare(`
  INSERT INTO up_permissions (action, role_id, created_at, updated_at) 
  VALUES (?, ?, datetime('now'), datetime('now'))
`);

const checkExist = db.prepare(`
  SELECT id FROM up_permissions WHERE action = ? AND role_id = ?
`);

permissions.forEach(p => {
  const exists = checkExist.get(p.action, roleId);
  if (!exists) {
    insertMeta.run(p.action, roleId);
    console.log('Granted:', p.action);
  } else {
    console.log('Already granted:', p.action);
  }
});
console.log('Done granting public permissions.');
